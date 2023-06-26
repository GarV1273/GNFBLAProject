// This script is used to validate the registration form. It tests for the following:
// 1. Unique email (ajax call to server)
// 2. Password match
// 3. Required fields depending on radio button selection
// 3a. If the create school option is selected, school name is required
// 3b. If the join school option is selected, school id is required
// 4. If they want to join a school, the school id must be valid (ajax call to server)

function validateRegister() {
  // Get all the form data
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const schoolName = document.getElementById('schoolName').value;
  const schoolId = document.getElementById('schoolID').value;

  // Get the radio button values
  const createOrJoinSchool = document.querySelector('input[name="createOrJoinSchool"]:checked').value;

  // Get the error message div to display errors
  const errorMessage = document.getElementById('errorMessage');

  // Check for matching passwords
  if (password !== confirmPassword) {
    return showErrorMessage('Passwords do not match');
  }

  // Check for a unique email using the getTeachers function in app.js using an ajax call
  let uniqueEmail = true;
  $.ajax({
    url: '/FBLA/getTeachers',
    type: 'GET',
    async: false,
    success: function (data) {
      // Loop through all the teachers
      console.log(data);
      for (const element of data) {
        // Check if the email is already in use
        if (element.email == email) {
          uniqueEmail = false;
          break;
        }
      }
    }
  });

  // If the email is not unique, show an error message
  if (!uniqueEmail) {
    return showErrorMessage('Email is already in use');
  }

  // Check if the user wants to create or join a school
  if (createOrJoinSchool == "create") {
    // Check if the school name is empty
    if (schoolName == "") {
      return showErrorMessage('School name is required');
    }
  } else {
    // They've chosen to join a school. Check if the school id is valid with an ajax call
    let validSchoolId = true;
    $.ajax({
      url: '/FBLA/getSchools',
      type: 'GET',
      async: false,
      success: function (data) {
        // Loop through all the schools
        for (const element of data) {
          // Check if the school id is valid
          if (element._id == schoolId) {
            return true;
          }
        }
        // If we get here, the school id is invalid
        validSchoolId = false;
      }
    });
    // If the school id is invalid, show an error message
    if (!validSchoolId) {
      return showErrorMessage('Invalid school id');
    }
  }
  return true;
}

// This function sets the error message to the parameter and unhides it
function showErrorMessage(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.innerHTML = message;
  errorMessage.style.display = 'block';
  return false;
}