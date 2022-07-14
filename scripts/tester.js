	var start = new Date();
	var startTime = start.getTime();
	var myVar = setInterval(function(){scaleTimer(startTime)}, 1000);
	var currentCard = "card0";
	var totalCards = document.getElementsByClassName('card').length;
	var numberCorrect = 0;
	
	function changeCard(currentCard, totalCards) {
		//put all cards to the back
		for (i=1;i<=totalCards;i++)
		{
			$("#card"+i).css({'z-index':1});
		}
		
		//add the ticks based on numberCorrect
		for(i=0;i<=10;i++)
		{
			if(i>numberCorrect){
				$("#"+i+"correct").css({'background-color':''});
				$("#"+i+"correct").html('&nbsp;');
			} else {
				$("#"+i+"correct").css({'background-color':'#4DFF4D'});
				$("#"+i+"correct").html('&#10004;');
			}
		}
		
		//pick next card and put it directly behind current card
		var newCard = pickNextCard();
		$("#"+currentCard).css({'z-index':3});
		$("#"+newCard).css({'z-index':2});
		
		//setup visibilities
		$("#cardbuttons").css({'visibility':'hidden'});
		$(".cardtranslated").css({'visibility':'hidden'});
		$("#seeanswerbutton").css({'visibility':'visible'});
		
		//swipe animation
		cardSwipe(currentCard);
		
		//sends new card to be updated as current card
		return newCard;
	}
	
	//visibility changes when view answer is clicked
	function viewAnswer() {
		$("#cardbuttons").css({'visibility':'visible'});
		$(".cardtranslated").css({'visibility':'visible'});
		$("#seeanswerbutton").css({'visibility':'hidden'});
	}
	
	//resizes the window on load and resize
	function setup() {
		var windowHeight = $(window).height();
		$("#container").css({'height':windowHeight +'px'});
	}	
	
	//moves the timer along as a percentage of total time (60secs at the moment)
	function scaleTimer() {
		var windowwidth = $(window).width();
		var currTime = new Date();
		var percentage = (currTime.getTime()-startTime)/600000;
		var margin = Math.round(windowwidth*percentage);
		$("#timer").css({'width':margin +'px'});
	}
	
	//swipe animation
	function cardSwipe(currentCard) {
		var rotation = 0;
		var maxRotation = 30;
		var translation = 0;
		var alpha = 1.0;
		var dividor = 20; //defines how quickly rotation approaches maximum
		
		var interval = setInterval(function() {
			//formula that approaches maxRotation
			rotation = ((dividor-1)*rotation + maxRotation)/dividor;
			
			translation -= 10;
			alpha -= 0.04;
			
			//set new position
			$("#"+currentCard).css({'transform':'translateX('+translation+'px) rotate('+Math.round(rotation)+'deg)'});
			$("#"+currentCard).css({'opacity':alpha});
			
			//end animation
			if(alpha<0.1) {
				clearInterval(interval);
				$("#"+currentCard).css({'z-index':1});
				$("#"+currentCard).css({'transform':'none'});
				$("#"+currentCard).css({'opacity':1});	
			}
		}, 10);
	}
	
	//pick next card (weighted towards cards higher up the stack)
	//set exponent to higher number for heavier weighting
	function pickNextCard()
	{
		var exponent = 2;
		var bigNumber = Math.random()*Math.pow(exponent, totalCards-1);
		if(bigNumber<1){ bigNumber += 1 }
		var choice = totalCards - Math.ceil(Math.log(bigNumber)/Math.log(exponent))	;
		
		//find card in choice's position
		var next = $('[data-pos='+choice+']').get();
		
		//find all cards
		var card = $(".card").get();
		
		for (i=0; i<card.length; i++)
		{
			var position = card[i].getAttribute('data-pos')*1;
			
			//set new positions of each card
			if(position>choice)
			{
				card[i].setAttribute('data-pos',position-1);
			} else if(position == choice) {
				card[i].setAttribute('data-pos',0);				
			} else if(position == 0) {
				card[i].setAttribute('data-pos',totalCards-1);
			}
		}
		
		//return card chosen
		return(next[0].id);
	}
	
	//resize window events
	window.onload=setup;
	window.onresize=setup;