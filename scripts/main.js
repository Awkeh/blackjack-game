Player = {
	name: "you",
	money: 100,
	bet: null,
  stays: false,
	cards: new Array(),
	hit: function()
  {
    if(this.cards.length < 5 && gameOn)
      {
				var pos = Player.cards.length;
        this.cards.push(new Card(pos));
        checkCards();
      }
  },
  stay: function()
  {
    if(gameOn)
    {
      this.stays = true;
      flipCard();
      checkCards();
    }
  }
}

Cpu = {
	name: "house",
	stays: false,
	cards: new Array(),
  hit: function()
  {
    if(this.cards.length < 5 && gameOn)
    {
			var pos = this.cards.length;
      this.cards.push(new Card(pos));
      checkCards();
    }
  },
  stay: function()
  {
    if(gameOn)
		{
			this.stays = true;
			checkCards();
		}
  }
}

function Card(x, hidden)
{
	var type = Math.round(Math.random() * 3);
	var c = 1 + Math.round( Math.random() * 12 ); // 1 - 13
	var pos = x;
  var path = "images/cards/card";
  var element = new Image();
	var repeated = false;

	switch(type)
	{
		case 0:
			type = "Clubs";
			break;
		case 1:
			type = "Diamonds";
			break;
		case 2:
			type = "Hearts";
			break;
		case 3:
			type = "Spades";
			break;
	}

  path += type;

  switch(c)
  {
    case 1:
      path += "A";
      break;
    case 11:
      path += "J";
      break;
    case 12:
      path += "K";
      break;
    case 13:
      path += "Q";
      break;
    default:
      path += c;
      break;
  }

  path += ".png";
  element.src = path;
  element.classList.add("card");
  if(hidden)
    element.classList.add("flipped");
  Object.assign(element.style,{
    left : pos * cardsSepacing + "px",
    transform : "rotate(" + ( -5 + Math.random()*10 ) + "deg)"
  });

	for(n in Cpu.cards)
	{
		if(Cpu.cards[n][0] == type && Cpu.cards[n][1] == c)
			repeated = true;
	}

	for(n in Player.cards)
	{
		if(Player.cards[n][0] == type && Player.cards[n][1] == c)
			repeated = true;
	}

	if(repeated)
		return Card(pos);
	else
		return [type,c,element];

}

function sumCards(target)
{
  var total = 0;
  for(n in target.cards)
	{
		if(target.cards[n][1] == 1) // If it's an ACE it might be 1 or 11
		{
			if(total <= elevenBelow)
				total += 11;
			else
				total += 1;
		} else
		{
			if(target.cards[n][1] > 10) // If it's J, K or Q its value is 10
				total += 10;
			else
				total += target.cards[n][1];
		}
	}

  return total;
}

function checkCards()
{
	pTotal = sumCards(Player);
	cTotal = sumCards(Cpu);

  var pGoneBust = pTotal > 21;
  var cGoneBust = cTotal > 21;
  var pBlackjack = pTotal == 21 && cTotal != 21;
  var cBlackjack = cTotal == 21 && pTotal != 21;
  var pWon = pTotal > cTotal && pTotal <= 21;
  var cWon = cTotal > pTotal && cTotal <= 21;
  var draw = cTotal == pTotal;

	if(Player.stays)
  {
    if(Cpu.stays && gameOn)
    {
      if( pGoneBust || cWon )
      {
        if( cBlackjack )
				{
					setTimeout(function()
					{
						msg("Blackjack! You lose $" + Player.bet );
					}, 2000);
				}
        else
				{
					setTimeout(function()
					{
						msg("You lose $" + Player.bet );
					}, 2000);
				}
        Player.money -= Player.bet;
      }
      else if( cGoneBust || pWon )
      {
        if( pBlackjack )
				{
					setTimeout(function()
					{
						msg("Blackjack! You win $" + Player.bet);
					}, 2000);
				}
        else
				{
					setTimeout(function()
					{
						msg("You win $" + Player.bet);
					}, 2000);
				}
        Player.money += Player.bet;
      } else
			{
				setTimeout(function()
				{
					  msg("Draw");
				}, 2000);
			}

      gameOn = false;
    }
    else
    {
      if( pGoneBust || cTotal >= hitBelow )
        Cpu.stay();
      else if(cTotal < hitBelow)
        Cpu.hit();
    }

  }

  postCards();

  setTimeout(function()
	{
		document.getElementById("money").innerHTML = "$" + Player.money;
	}, 2000);

}

function postCards()
{
  document.getElementById("cpu_hand").innerHTML = "";
  document.getElementById("player_hand").innerHTML = "";

  for(n in Cpu.cards)
    document.getElementById("cpu_hand").append(Cpu.cards[n][2]);

  for(n in Player.cards)
    document.getElementById("player_hand").append(Player.cards[n][2]);
}

function flipCard()
{
	document.getElementById("cpu_hand").children[0].classList.add("unflip");
	setTimeout(function()
	{
		document.getElementById("cpu_hand").children[0].classList.remove("flipped");

		setTimeout(function(){
			document.getElementById("cpu_hand").children[0].classList.remove("unflip"); // Fixes the bug where if you stay, go to the menu and come back, the card flips again
		}, 1000);

	}, 1000);
}

function bet()
{
	if(!gameOn)
  {
		var ammount = document.getElementById("bet").value;
				ammount = parseInt(ammount);
    if(Player.money >= ammount)
    {
			if( ammount >= 2 && ammount <= 500)
			{
				gameOn = true;
	      Cpu.cards = [ new Card(0, true), new Card(1) ];
	      Cpu.stays = false;
	    	Player.cards = [ new Card(0), new Card(1) ];
	      Player.stays = false;
	      Player.bet = ammount;
	    	postCards();
	    	checkCards();
			} else if( ammount > 500 )
				msg("Maximum bet allowed is $500");
			else
				msg("Minimum bet allowed is $2");

    } else
      msg("You dont have the money");
  }
}

onload = function()
{
  // Game parameters
  gameOn = false;
	cardsSepacing = 75; // Width in pixels of cards
  hitBelow = 17; // The dealer can only hit if its cards sum up to 16 or less
  elevenBelow = 10; // It's up to the player to decide if an ACE is 1 or 11, but here ACEs are 11 only if the sum is lesser than 10
}
