var texts = [
	"* ; , : . ' 1234567890 Blåbærsyltetøy. While it may hold true that the final few seconds of a bike race are fastest and apparently chaotic, at 70 kph and 200 heartbeats per minute, there's simply no time for anxiety. Adrenaline, yes, Instinct, sure. But fear, no.",
	"We don't need no education. We don't need no thought control. No dark sarcasm in the classroom - teachers leave them kids alone! All in all it's just another brick in the wall.",
	"The terminator wouldn't stop, it would never leave him. It would never hurt him or shout at him or get drunk and hit him or say it was too busy to spend time with him. And it would die to protect him. Of all the would-be fathers that came over the years, this thing, this machine, was the only thing that measured up. - from Terminator 2: Judgment Day, a movie directed by James Cameron",
	"The terminator wouldn't stop",
	"Do I really look like a guy with a plan? You know what I am? I'm a dog chasing cars. I wouldn't know what to do with one if I caught it. You know, I just do things. I'm not a schemer. I try to show the schemers how pathetic their attempts to control things really are.",
	"So what's in this for you? Should you rush out in search of a mission? Should you quit your job and find a goal? Probably not. But look around you. You may be on a mission, and not realize it yet.",
	'Ideology: the process of making ideas. Certain artisans were chosen for this occupation at an early age and were trained in mental workhouses or asylums. They were known as idealists, and were expected to provide a fixed number of ideas to be exhibited or dramatised for the benefit of the public',
	"One day you're in a funk about things, telling a friend that years of evidence point to the conclusion that you will be single for the rest of your life. That night you meet someone, and a year later you're engaged to be married.",
	'Sparkling wines are wines that contain carbon dioxide bubbles. Carbon dioxide gas is a natural byproduct of fermentation, and winemakers sometimes decide to trap it in the wine.',
	'Here, the oregano and other trace materials sitting on the surface might be of some importance if they changed the surface radiance in any appreciable way.',
	'First, the layer of dough bakes into bread, a low-water-content material with a large number of nonconnecting small air spaces. Second, the tomato paste dehydrates, and third, the mozzarella undergoes a complex series of transitions involving protein denaturation and lipid rearrangement from regular liquid crystal to more disordered states.',
	'I must nevertheless point out that our profession very closely approaches the idea of that which is called art. Into it enter all the elements which go to form art - vocation, inspiration, fantasy, inventiveness, ambition, and a long and arduous apprenticeship to the science.',
	'For centuries, human society has taken the gifts of nature for granted. As civilizations grew, humans spread out across the face of the planet, taking what they needed from the land and producing more and more waste materials with little regard for the future.',
	"I think you're gonna find - when all this stuff is over and done - I think you're gonna find yourself one smiling guy.",
	"The brain can be a tool. But when you can't stop thinking of that math problem or phone number, or when troubling thoughts and memories arise without your intent, it's not your brain working, but your mind wandering. Then the mind controls you.",
	'Most popular song lyrics have two sections - a verse and a bridge, where the bridge offers a contrast to the verse but is not the place where the song is summarized.',
	'En ung mor var gravid for andre gang og forsøkte å forklare hvordan det skjedde til den lille jenta si. Hun forklarte at en baby vokser i magen, og at det begynte med ett egg og en sædcelle som møttes. Pappa hadde sæden, og mamma hadde egget. Så spurte jenta moren, "Hvis du trenger sæd og egg til å lage en baby, og egget allerede er i magen din, hvordan kommer sæden inn dit? Svelger du det mamma?" Så svarte moren: "Hun gjør det hvis hun vil ha en ny selskapskjole."',
	'Mannen sa til kona: "Rumpa di begynner å bli skikkelig stor. Den er nesten like stor som grillen!" Senere da lå de i senga, begynte mannen å tafse på kona, men ble avfeid. "Hva er det?" spurte mannen. "Tror du virkelig jeg fyrer opp hele denne grillen for 1 liten pølse?" svarte kona.',
	'En mann var på fisketur og fanget en krokodille. Krokodillen sa: "Vær så snill og la meg gå! Du skal få oppfylt hvilket ønske du vil." Mannen svarte: "Okay, jeg ønsker at kuken min nådde ned til bakken." Krokodillen bet av ham beina.',
];

var $typeInput,
	currentText,
	currentHtml = '',
	currentWordHtml = '',
	wordProgress = 0,
	$spanArray,
	$you,
	winning = false,
	firstKeyDown = true,
	$timer,
	currentWord,
	currentCharacterCount = 0,
	relativeTime = 1,
	timerInterval,
	charProgress,
	charSpeedInterval,
	currentCharSpeed,
	storySelectText = '';

$(document).ready(function () {
	// setup
	$you = $('#you .progress');
	$typeInput = $('#typeInput');
	$timer = $('#timer');

	// Set random text
	currentText = texts[Math.floor(Math.random() * texts.length)].split(' ');

	newText();
	for (var i = 0; i < texts.length; i++) {
		storySelectText += '<option value="' + i + '">' + texts[i].substr(0, 20);
		+'</option>';
	}
	$('#storySelect').html(storySelectText);
	$('#storySelect').on('change', function () {
		currentText = texts[$(this).val()].split(' ');
		reset();
		newText();
	});

	// on input
	$typeInput.on('input', onKeydown);
});

function reset() {
	// Reset
	firstKeyDown = true;
	relativeTime = 1;
	wordProgress = 0;
	clearInterval(timerInterval);
	clearInterval(charSpeedInterval);
	$timer.html('0.0');
	$('#speed').text('0');
	$you.velocity(
		{
			width: '0%',
		},
		300
	);

	// Clear typing input and set focus on it
	$typeInput.val('').focus();
}

function newText() {
	winning = false;
	$(document.body).removeClass('winning');
	// Make and set HTML for current text
	currentHtml = '';
	for (var i = 0; i < currentText.length; i++) {
		currentWordHtml = '';
		for (var j = 0; j < currentText[i].length; j++) {
			currentWordHtml += '<span>' + currentText[i][j] + '</span>';
		}
		currentHtml += '<span>' + currentWordHtml + '</span>';
	}
	$('#currentText').html(currentHtml);
	$spanArray = $('#currentText').children();
	$spanArray.eq(0).addClass('current');
	currentWord = currentText[wordProgress];
}

function onKeydown() {
	if (firstKeyDown) {
		updateTimer();
		charSpeed();
		firstKeyDown = false;
	}
	// counting correct characters
	currentCharacterCount = 0;
	for (var i = 0; i < $typeInput.val().length; i++) {
		if (currentWord[i] == $typeInput.val()[i]) {
			currentCharacterCount++;
		} else {
			break;
		}
	}
	$spanArray.eq(wordProgress).children().removeClass('charCorrect charWrong');
	for (var i = 0; i < currentCharacterCount; i++) {
		$spanArray.eq(wordProgress).children().eq(i).addClass('charCorrect');
	}
	for (var i = currentCharacterCount; i < $typeInput.val().length; i++) {
		$spanArray.eq(wordProgress).children().eq(i).addClass('charWrong');
	}

	// progress handler
	if (wordProgress < currentText.length) {
		if ($typeInput.val() == currentWord + ' ') {
			wordProgress++;
			currentCharacterCount = 0;
			$typeInput.val('');
			$spanArray
				.eq(wordProgress - 1)
				.removeClass('current')
				.addClass('done');
			$spanArray.eq(wordProgress).addClass('current');
			$you.velocity(
				{
					width: (100 / currentText.length) * wordProgress + '%',
				},
				300
			);
			if (wordProgress < currentText.length) {
				currentWord = currentText[wordProgress];
			} else if (!winning) {
				winning = true;
				firstKeyDown = true;
				relativeTime = 1;
				wordProgress = 0;
				clearInterval(timerInterval);
				clearInterval(charSpeedInterval);
				$('body').addClass('winning');
			}
		}

		// Kept going after you missed the spacebar on a correct word?
		if (
			$typeInput.val().length > currentWord.length &&
			currentWord.length == currentCharacterCount
		) {
			$spanArray.eq(wordProgress).addClass('lostInSpace');
		} else {
			$spanArray.eq(wordProgress).removeClass('lostInSpace');
		}
	}
}

// counting seconds
function updateTimer() {
	timerInterval = setInterval(function () {
		relativeTime++;
		$timer.html(Math.floor(relativeTime / 10) + '.' + (relativeTime % 10));
	}, 100);
}

function charSpeed() {
	charSpeedInterval = setInterval(function () {
		charProgress = 0;
		for (var i = 0; i < wordProgress; i++) {
			charProgress += currentText[i].length;
		}
		currentCharSpeed = Math.floor((charProgress / relativeTime) * 600);
		$('#speed').text(currentCharSpeed);
	}, 500);
}
