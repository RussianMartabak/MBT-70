const Discord = require('discord.js');
const client = new Discord.Client();
const PREFIX = '$';
const ImportSlav = require('./russian.js');
const RussianTable = ImportSlav.RussianTable;
const ImportHiragana = require('./hiragana.js');const HiraganaTable = ImportHiragana.HiraganaTable;
const ImportKatakana = require('./katakana.js');const KatakanaTable = ImportKatakana.KatakanaTable;
const ImportKanji	= require('./kanji.js');const KanjiTable = ImportKanji.KanjiTable;
var tempmsg;//global variable for message sent in discord channel
var quizstate=0; 
let font;
let hquest;let kquest;//for rng usage in hiragana+katakana quiz
var FontAnswer;//store font quiz answer
function transliterate(input, table){//transliterate (specified input to be checked and the reference table)
	let output = [];
for (let i = 0; i < input.length; i++) {//loop check array element on by one
	let funcfont = input[i];
	
	let doubleletter = input[i]+input[i+1];
	let trippleletter = input[i]+input[i+1]+input[i+2];
	let getIt = table.find(obj => {
		return obj.font===funcfont //condition need to be true to return object from array, in this case its letter from string
	});
	let doublefont = table.find(obj =>{
		return obj.font===doubleletter
	});
	let tripplefont = table.find(obj =>{
		return obj.font===trippleletter
	});
	console.log('doubleletter '+ doubleletter);
	console.log(doublefont);
	if(tripplefont!=undefined && trippleletter===tripplefont.font){
		output.push(tripplefont.desc);
		i+=2;
	}
	else if (doublefont!=undefined && doubleletter===doublefont.font ){//check letter and match it with the array, will check 2 letter if its in the array
		output.push(doublefont.desc);
		i++;
	}
	else if(getIt!=undefined && getIt.font===funcfont){
		output.push(getIt.desc);
	}else{
		output.push(funcfont);
	}
	// Do something with entry
  }
console.table(table);
return output.join("");


}
function RNG (limit){

	let i=Math.floor(Math.random() *limit );
	return i;
}
function FontQuizCheck (table, randomizer){
	if(quizstate===1 && tempmsg.author.bot===false){
		quizstate=0
		console.log('the answer should be '+FontAnswer)
				if (tempmsg.content===FontAnswer){
					tempmsg.channel.send('Yep. Correct it is '+FontAnswer);
					console.log('laststate= '+quizstate);
				}else{
					tempmsg.channel.send('You are wrong, its '+FontAnswer);
					console.log('laststate= '+quizstate);
				}
		}else{
			return;
		}

}
let savedword;//saved word prepped for lettercount
let tanks = [
	{name:'MBT 70', weapon:'152 mm XM150E5'},
	{name:'M1 Abrams', weapon:'105 mm L/52 M68A1 rifled gun'},
	{name:'Leopard 2', weapon:'120 mm Rheinmetall L/55 smoothbore gun'},
	{name:'SU-85', weapon: '85 mm (3.34 in) D-5T gun'},
	{name:'Bob Semple', weapon: '88 mm Maschinengewehr 128'}
];
let gg= new Object({});
let NatoPhonetic =[//nato library
	{font:'a', desc:'Alpha'},
	{font:'b', desc:'Bravo'},
	{font:'c', desc:'Charlie'},
	{font:'d', desc:'Delta'},
	{font:'e', desc:'Echo'},
	{font:'f', desc:'Foxtrot'},
	{font:'g', desc:'Golf'},
	{font:'h', desc:'Hotel'},
	{font:'i', desc:'India'},
	{font:'k', desc:'Kilo'},
	{font:'m', desc:'Mike'},
	{font:'n', desc:'November'},
	{font:'o', desc:'Oscar'},
	{font:'s', desc:'Sierra'},
	{font:'t', desc:'Tango'},
	{font:'u', desc:'Uniform'},
	{font:'v', desc:'Victor'},
	{font:'y', desc:'Yankee'},
	{font:'ye', desc:'Da'}
];

client.once('ready', () => {
	console.log('bot is online');
	client.user.setActivity('Ode an die Freude', {type:'PLAYING'});
	
	console.log(RussianTable[0].desc);
	
});

client.on('message', message =>{//main code
	tempmsg=message;
	const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const argwithspace = message.content.split(' ').splice(1).join(' ');
	const profileEmbed = new Discord.MessageEmbed();
	let user = message.mentions.users.first() || message.author;
	let mbt70 = tanks[0];
	let abrams = tanks[1];
	let leopard = tanks[2];
	let kanjiq;
	const txt=message.content;
	
	
	FontQuizCheck();
	
	switch (command){
		case 'hilfe':
			message.channel.send('prefix=$\n`hiragana`= transiletrate to hiragana. (arg=whatever)\n`hquiz`=start a hen-, I mean hiragana quiz\n`natofy`=convert to NATO Phonetic\n`profile`=check prfile pic of someone (optional:enhance)');
			break;
		case 'hiragana':
			
			let HiraganaInput = argwithspace;
			message.channel.send(transliterate(HiraganaInput, HiraganaTable));
			break;
		case 'hquiz':
			let u=RNG();
			
			let masukan= argwithspace;
			
			console.log('input = '+masukan)
			if(quizstate<1){
				hquest=RNG(46);
				message.channel.send('What is '+ HiraganaTable[hquest].desc+"?");
				quizstate+=1;
				FontAnswer=HiraganaTable[hquest].font;
				console.log('state 1 ='+quizstate);
			}else if(quizstate==1){
				kquizstate=0
				if (masukan===HiraganaTable[quest].font){
					message.channel.send('Yep. Correct it is '+HiraganaTable[hquest].font);
					console.log('laststate= '+quizstate);
				}else{
					message.channel.send('You are wrong, its '+HiraganaTable[hquest].font);
					console.log('laststate= '+quizstate);
				}

			}else{
				message.channel.send('invalid');
			}
			
			break;
		case 'kquiz' :
			
			if(quizstate<1){
				kquest=RNG(KatakanaTable.length);
				message.channel.send('What is this '+KatakanaTable[kquest].desc);
				FontAnswer=KatakanaTable[kquest].font;
				quizstate+=1;
			}else{
				return;
			}
			break;
		case 'kanjiq' : 
			if(quizstate<1){
				kanjiq=RNG(KanjiTable.length);
				message.channel.send('What is '+KanjiTable[kanjiq].desc+'\nAnswer format: meaning(reading)');
				FontAnswer=KanjiTable[kanjiq].font;
				quizstate+=1;

			}else{
				return;
			}
			break;
		case 'natofy' :
			
			let NatoOutput = [];
			let NatoInput = args[0];
			
			for (let i = 0; i < NatoInput.length; i++) {//loop check array element on by one
				font = NatoInput[i];
				let doubleletter = NatoInput[i]+NatoInput[i+1];
				let getNato = NatoPhonetic.find(obj => {
					return obj.font===font //condition need to be true to return object from array, in this case its letter from string
				});
				let doublefont = NatoPhonetic.find(obj =>{
					return obj.font===doubleletter
				})
				
				console.log(doubleletter);
				if (doublefont!=undefined && doubleletter===doublefont.font ){//check letter and match it with the array, will check 2 letter if its in the array
					NatoOutput.push(doublefont.desc);
					i++;
				}
				else if(getNato!=undefined && getNato.font===font){
					NatoOutput.push(getNato.desc);
				}else{
					NatoOutput.push(font);
				}
				// Do something with entry
			  }
			  message.channel.send(NatoOutput.join(" "));

			break;
		case 'profile' :
			 
			profileEmbed.setColor('#0099ff')
			profileEmbed.setTitle(user.username)
			if (args[1]=='enhance'){
				profileEmbed.setImage(user.avatarURL({'size': 512}))//setting ImageURLOptions
			}else{
			profileEmbed.setImage(user.displayAvatarURL())
			}
			console.log(user.displayAvatarURL())
			message.channel.send(profileEmbed)
			//profiling system
			break;
		case 'tanklist':
			let docount = 0;
			let federatsie = Number(tanks.length-docount);
			let listpos = -1;
		    
			while (tanks.length>docount){
				listpos+=1;
				message.channel.send(`${tanks[listpos].name} main gun = ${tanks[listpos].weapon}`);
				docount+=1;
				console.log(federatsie);
			}
			break;
		case 'addtank':
			let listpos1 = 0;
			let checkcount = 0;
			let panjang = tanks.length;
			let dupe;
			function dupecheck (name){//chceck if duplicate exist in array
				if (name===tanks[listpos1].name){
					return true
				}else{
					listpos1+=1;
					checkcount+=1;
				}
			}
			while (checkcount<panjang){
				dupe = dupecheck(args[0]);
			}
			if (dupe===true) return message.channel.send('no duplicate tank allowed');
			tanks.push({name: args[0],weapon: args[1]});
			break;
		
		case 'buytank':
			let spec = tanks.find(obj => {
				return obj.name===argwithspace //condition need to be true to return object from array, in this case its tank name
			});
			message.channel.send(`${spec.name} has been added to OUR arsenal`);
			break;
		case 'typecheck' :
			let typedur = user.typingDurationIn(message.channel);
			message.channel.send('<@'+user.id+'> ' + 'has been typing for ' + typedur + ' miliseconds')
			break;
		case 'ak47' :
			for (let NumbersMason = 0;;NumbersMason+=1){
				if (NumbersMason<31){
					message.channel.send(`${NumbersMason} rounds expended`);
				} else {
					message.channel.send('all rounds has been expended');
					break;
				}
				
			}
			break;
		case 'isiteven?' ://expendable code
			let input = args[0];
			function isEven (x) {
				if (x%2 === 0 && x>=0){
					return 'yes, the number is even'
				} else {
					return 'nope, this is odd'
				}
			}
			message.channel.send (isEven(input));
			break;
		case 'word' :
			savedword = argwithspace;
			console.log (savedword);
			break;
		case 'lettercount' ://checking letters one by one and count them if they fulfilled specific condition, in this case, if they are equal to second arg given by user
			let word;	
			console.log ('saved word= ' + savedword);
			if (args[1]===undefined) {word = savedword
			}else {word = args[0]};
			let letter = args[1] || args[0];
			let wordlength = word.length;
			if (word===undefined) return message.channel.send ('WARNING FATAL ERROR SELF DESTRUCT IMMINENT\njk');
			//The great filter that blocks empty string 
			function countA (target, font){
				console.log(target);
				let kata = target.toLowerCase();
				let Acount= 0;
				let count= 0;
				let pos = -1;
				let sight = font.toLowerCase();
				console.log(count);

				if (wordlength==count){
					console.log(Acount);
					return 'great success'
				} else {
					while (count<=wordlength) {
						if (kata[pos+=1]==sight){
							Acount+=1
						}
						count+=1;
						console.log('loopengine running')

					}
					return `this word contain ${Acount} ${font} letters`;
				} 
			}
			
				
			message.channel.send (`${countA(word, letter)}`);
				 
			break;
		case 'debug' :
			function stringcheck (target){
				console.log(target.length)
				console.log(target)
			}
			stringcheck(args[0]);
			break;
		

	}
})
client.login();//unique token for logging in bot 

