document.addEventListener("DOMContentLoaded", function () {
  const searchbutton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-cards");

  //return true or false based on a regex
  function validateusername(username) {
    if (username.trim() === " ") {
      alert("Username shold not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    //api call so async function used
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchbutton.textContent = "Searching....";
      searchbutton.disabled = true;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to fetch the user details");
      }
      const data = await response.json();
      console.log("Logging data: ", data);
    } catch (error) {
    } finally {
    }
  }

  searchbutton.addEventListener("click", function () {
    const usename = usernameInput.value;
    console.log("Loggin usename : ", usename);
    if (validateusername(usename)) {
      fetchUserDetails(usename);
    }
  });
});
