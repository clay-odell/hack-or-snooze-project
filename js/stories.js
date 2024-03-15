"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteButton = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showFavoriteButton = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
      <div>
      ${showDeleteButton ? getDeleteButtonHTML(): ""}
      ${showFavoriteButton ? getFavoriteButtonHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        </div>
      </li>
    `);
}
/** Get Delete Button HTML */
function getDeleteButtonHTML(){ 
  return `<span class="delete">
  <i class="fas fa-trash"></i>
  </span>`;
}

/** The HTML for a favorite button based on whether it is or isn't a favorited story */
function getFavoriteButtonHTML(story, user){
  const isFavorite = user.isFavorite(story);
  const buttonType = isFavorite ? "fas" : "far";
  return `<span class="favorite">
  <i class="${buttonType} fa-arrow-alt-circle-up"></i>
  </span>`;
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  // console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
/**Deletes story from storyList */
async function deleteStory(evt) {
  // console.debug("deleteStory");
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");
  await storyList.removeStory(currentUser, storyId);
  await addUserStoriesOnPage();
}
$userStoriesList.on("click", ".delete", deleteStory);
/** Adds a user submitted story from the newStoryForm on submit button click */
async function addNewStoryOnPage(evt) {
  evt.preventDefault();
  
  const title = $("#new-story-title").val();
  const author = $("#new-story-author").val();
  const url = $("#new-story-url").val();
  const username = currentUser.username;
  const newStoryData = { username, title, author, url };
  const story = await storyList.addStory(currentUser, newStoryData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $newStoryForm.trigger("reset");
  $newStoryForm.slideUp("slow");
  putStoriesOnPage();
}

$("#story-submit").on("click", addNewStoryOnPage);

async function addUserStoriesOnPage() {
  // console.debug("addUserStoriesOnPage");
  $userStoriesList.empty();
  if (currentUser.ownStories.length === 0) {
    $userStoriesList.append(
      `<h5>${currentUser.username} hasn't submitted any stories.</h5>`
    );
  } else {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true);
      $userStoriesList.append($story);
    }
  }
  $userStoriesList.show();
}
async function addFavoritedStoriesOnPage() {
  // console.debug("addFavoritedStoriesOnPage");
  $favoritesList.empty();
  if (currentUser.favorites.length === 0) {
    $favoritesList.append(
      `<h5>${currentUser.username} hasn't favorited any stories.</h5>`
    );
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritesList.append($story);
    }
  }
  $favoritesList.show();
}
async function toggleStoryFavorite(evt){
  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  console.log(`storyId: ${storyId}`);
  const story = storyList.stories.find(s => s.storyId === storyId);
  console.log(`story: ${JSON.stringify(story)}`); 
  if ($target.hasClass("fas")){
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}
$storiesList.on("click", ".favorite", toggleStoryFavorite);