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

    // const url=`https://leetcode.com/graphql`
    try {
      searchbutton.textContent = "Searching....";
      searchbutton.disabled = true;
      // statsContainer.classList.add("hidden");
      // const response = await fetch(url);
      const proxyUrl = "";

      const targetUrl = "https://leetcode.com/graphql/";
      const myHearders = new Headers();
      myHearders.append("content-type", "application/json");

      const graphql = JSON.stringify({
        query:
          "\n   query userSessionProgress($username: String!) {\n allQuestionsCount {\n   difficulty\n   count\n   }\n matchedUser(username: $username) {\n   submitStats {\n   acSubmissionNum\n    totalSubmission {\n      difficulty\n               count\n       submissions\n     }\n   }\n    }\n}\n   ",
        variables: { username: `${username}` },
      });

      const requestOptions = {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: graphql,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:3000/api/leetcode",
        requestOptions,
      );
      if (!response.ok) {
        throw new Error("Unable to fetch the user details");
      }
      const parsedData = await response.json();
      console.log("Logging data: ", parsedData);

      displayUserData(parsedData);
    } catch (error) {
      statsContainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
      searchbutton.textContent = "Search";
      searchbutton.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(parsedData) {
    const totalQues = parsedData.data.allQuestionsCount[0].count;
    const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
    const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
    const totalHardQues = parsedData.data.allQuestionsCount[3].count;

    const solvedTotalQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
    const solvedTotalEasyQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
    const solvedTotalMediumQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
    const solvedTotalHardQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

    updateProgress(
      solvedTotalEasyQues,
      totalEasyQues,
      easyLabel,
      easyProgressCircle,
    );
    updateProgress(
      solvedTotalMediumQues,
      totalMediumQues,
      mediumLabel,
      mediumProgressCircle,
    );
    updateProgress(
      solvedTotalHardQues,
      totalHardQues,
      hardLabel,
      hardProgressCircle,
    );

    const cardData = [
      {
        label: " overall submissions",
        value:
          parsedData.data.matchedUser.submitStats.totalSubmissionNum[0]
            .submissions,
      },
      {
        label: " overall Easy submissions",
        value:
          parsedData.data.matchedUser.submitStats.totalSubmissionNum[1]
            .submissions,
      },
      {
        label: " overall Medium submissions",
        value:
          parsedData.data.matchedUser.submitStats.totalSubmissionNum[2]
            .submissions,
      },
      {
        label: " overall Hard submissions",
        value:
          parsedData.data.matchedUser.submitStats.totalSubmissionNum[3]
            .submissions,
      },
    ];
    console.log("card ka data :", cardData);
    cardStatsContainer.innerHTML = cardData
      .map(
        data`
        <div class="card">
        <h4>${data.label}</h4>
        <p>${data.value}</p>

        
        </div>`,
      )
      .join("");
  }

  searchbutton.addEventListener("click", function () {
    const usename = usernameInput.value;
    console.log("Loggin usename : ", usename);
    if (validateusername(usename)) {
      fetchUserDetails(usename);
    }
  });
});
