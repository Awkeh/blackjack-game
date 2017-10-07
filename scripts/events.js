var cardsSepacing, hitBelow, elevenBelow, gameOn; // Global variables

onload = function()
{
  // Game parameters
  gameOn = false;
	cardsSepacing = 75; // Width in pixels of cards
  hitBelow = 17; // The dealer can only hit if its cards sum up to 16 or less
  elevenBelow = 10; // It's up to the player to decide if an ACE is 1 or 11, but here ACEs are 11 only if the sum is lesser than 10
}
