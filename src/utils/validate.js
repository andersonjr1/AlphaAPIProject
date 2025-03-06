function isValidEmail(email) {
  return (
    email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) && email.length <= 50
  );
}

function isValidPassword(password) {
  return (
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    password.length >= 8 &&
    password.length <= 30
  );
}

function isValidName(name) {
  return name.length >= 3 && name.length <= 50;
}

function isValidPlace(place) {
  return place.length >= 3 && place.length <= 50;
}

function isValidDescription(description) {
  return description.length >= 0 && description.length <= 250;
}

function isValidDate(date) {
  const datetimeLocalRegex =
    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!datetimeLocalRegex.test(date)) {
    return false;
  }

  const dateTime = new Date(date);

  const now = new Date();

  if (now.getTime() > dateTime.getTime()) {
    return false;
  }

  //Adds one year to the new object date
  now.setFullYear(now.getFullYear() + 1);

  if (dateTime.getTime() > now.getTime()) {
    return false;
  }

  return true;
}

function isValidParticipants(participants) {
  return !isNaN(participants) && participants > 0 && participants < 100;
}

export {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidPlace,
  isValidDescription,
  isValidDate,
  isValidParticipants,
};
