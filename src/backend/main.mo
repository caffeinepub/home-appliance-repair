import Map "mo:core/Map";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Appliance and Status Types
  type ApplianceType = {
    #ledTV;
    #ac;
    #fridge;
  };

  type BookingStatus = {
    #pending;
    #accepted;
    #inProgress;
    #completed;
    #cancelled;
  };

  public type Booking = {
    id : Nat;
    customer : Principal;
    appliance : ApplianceType;
    issueDescription : Text;
    preferredDateTime : Time.Time;
    contactPhone : Text;
    status : BookingStatus;
    createdAt : Time.Time;
    lastUpdated : Time.Time;
  };

  module Booking {
    func compareCore(b1 : Booking, b2 : Booking) : Order.Order {
      Int.compare(b1.createdAt, b2.createdAt);
    };
    public func compare(booking1 : Booking, booking2 : Booking) : Order.Order {
      Nat.compare(booking1.id, booking2.id);
    };
  };

  // Internal Booking Store
  var nextBookingId = 1;
  let bookings = Map.empty<Nat, Booking>();

  // Create Booking
  public shared ({ caller }) func createBooking(booking : {
    appliance : ApplianceType;
    issueDescription : Text;
    preferredDateTime : Time.Time;
    contactPhone : Text;
  }) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create bookings");
    };
    let id = nextBookingId;
    nextBookingId += 1;
    let now = Time.now();
    let newBooking : Booking = {
      id;
      customer = caller;
      appliance = booking.appliance;
      issueDescription = booking.issueDescription;
      preferredDateTime = booking.preferredDateTime;
      contactPhone = booking.contactPhone;
      status = #pending;
      createdAt = now;
      lastUpdated = now;
    };
    bookings.add(id, newBooking);
    id;
  };

  // Get All Bookings (Admin/Tech Only)
  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins/techs can view all bookings");
    };
    bookings.values().toArray();
  };

  // Get Customer's Bookings
  public query ({ caller }) func getMyBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their bookings");
    };
    bookings.values().toArray().filter(func(b) { b.customer == caller });
  };

  // Get Single Booking
  public query ({ caller }) func getBooking(id : Nat) : async ?Booking {
    switch (bookings.get(id)) {
      case (null) { null };
      case (?booking) {
        if (booking.customer == caller or AccessControl.hasPermission(accessControlState, caller, #admin)) {
          ?booking;
        } else {
          Runtime.trap("Unauthorized to view this booking");
        };
      };
    };
  };

  // Update Booking Status (Admin/Tech Only)
  public shared ({ caller }) func updateStatus(id : Nat, newStatus : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins/techs can update status");
    };
    let booking = getBookingInternal(id);
    // Prevent certain status transitions
    if (booking.status == #completed or booking.status == #cancelled) {
      Runtime.trap("Cannot update completed or cancelled bookings");
    };

    let updatedBooking : Booking = {
      id = booking.id;
      customer = booking.customer;
      appliance = booking.appliance;
      issueDescription = booking.issueDescription;
      preferredDateTime = booking.preferredDateTime;
      contactPhone = booking.contactPhone;
      status = newStatus;
      createdAt = booking.createdAt;
      lastUpdated = Time.now();
    };
    bookings.add(id, updatedBooking);
  };

  // Customer Cancel Booking
  public shared ({ caller }) func cancelBooking(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel bookings");
    };
    let booking = getBookingInternal(id);
    if (booking.customer != caller) {
      Runtime.trap("Unauthorized: Cannot cancel another customer's booking");
    };
    if (booking.status != #pending) {
      Runtime.trap("Only pending bookings can be cancelled");
    };
    let updatedBooking : Booking = {
      id = booking.id;
      customer = booking.customer;
      appliance = booking.appliance;
      issueDescription = booking.issueDescription;
      preferredDateTime = booking.preferredDateTime;
      contactPhone = booking.contactPhone;
      status = #cancelled;
      createdAt = booking.createdAt;
      lastUpdated = Time.now();
    };
    bookings.add(id, updatedBooking);
  };

  // Admin Cancel Any Booking
  public shared ({ caller }) func adminCancelBooking(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins/techs can cancel bookings");
    };
    let booking = getBookingInternal(id);
    if (booking.status == #cancelled) {
      Runtime.trap("Booking already cancelled");
    };
    let updatedBooking : Booking = {
      id = booking.id;
      customer = booking.customer;
      appliance = booking.appliance;
      issueDescription = booking.issueDescription;
      preferredDateTime = booking.preferredDateTime;
      contactPhone = booking.contactPhone;
      status = #cancelled;
      createdAt = booking.createdAt;
      lastUpdated = Time.now();
    };
    bookings.add(id, updatedBooking);
  };

  // Helper: Get Booking or Trap
  func getBookingInternal(id : Nat) : Booking {
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) { booking };
    };
  };
};
