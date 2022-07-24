/**
  * Edit features in './message/msg.js'
  * Contact me on WhatsApp wa.me/6281319944917
  * Follow : https://github.com/rtwone
  * Follow : https://github.com/GetSya
*/

"use strict";
const {
	default: makeWASocket,
	BufferJSON,
	WA_DEFAULT_EPHEMERAL,
	generateWAMessageFromContent,
	proto,
	initInMemoryKeyStore,
	DisconnectReason,
	AnyMessageContent,
        makeInMemoryStore,
	useSingleFileAuthState,
	delay
} = require("@adiwajshing/baileys")
const figlet = require("figlet");
const fs = require("fs");
const moment = require('moment')
const chalk = require('chalk')
const logg = require('pino')
const clui = require('clui')
const { Spinner } = clui
const { getBuffer, serialize} = require("./lib/myfunc");
const { color, mylog, infolog } = require("./lib/color");
const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')
let setting = JSON.parse(fs.readFileSync('./config.json'));
let session = `./${setting.sessionName}.json`
const { state, saveState } = useSingleFileAuthState(session)

function title() {
      console.clear()
	  console.log(chalk.bold.green(figlet.textSync('Jojo-Bot', {
		font: 'Standard',
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 80,
		whitespaceBreak: false
	})))
	console.log(chalk.yellow(`\n                        ${chalk.yellow('[ Powered By Iyan & Arasya ]')}\n\n${chalk.red('Jojo-Bot')} : ${chalk.white('WhatsApp Bot Multi Device')}\n${chalk.red('Follow Insta Dev')} : ${chalk.white('@sofunsyabi.jpg')}\n${chalk.red('Message Me On WhatsApp')} : ${chalk.white('+62 813-1994-4917')}\n${chalk.red('Donate')} : ${chalk.white('088213292687 ( Gopay/Pulsa )')}\n`))
}

/**
* Uncache if there is file change;
* @param {string} module Module name or path;
* @param {function} cb <optional> ;
*/
function nocache(module, cb = () => { }) {
	console.log(`Module ${module} sedang diperhatikan terhadap perubahan`) 
	fs.watchFile(require.resolve(module), async () => {
		await uncache(require.resolve(module))
		cb(module)
	})
}
/**
* Uncache a module
* @param {string} module Module name or path;
*/
function uncache(module = '.') {
	return new Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(module)]
			resolve()
		} catch (e) {
			reject(e)
		}
	})
}

const status = new Spinner(chalk.cyan(` Booting WhatsApp Bot`))
const starting = new Spinner(chalk.cyan(` Preparing After Connect`))
const reconnect = new Spinner(chalk.redBright(` Reconnecting WhatsApp Bot`))

const store = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

const connectToWhatsApp = async () => {
	const conn = makeWASocket({
            printQRInTerminal: true,
            logger: logg({ level: 'fatal' }),
            auth: state,
            browser: ["Jojo-Bot", "Safari", "3.0"]
        })
	title()
        store.bind(conn.ev)
	
	/* Auto Update */
	require('./message/help')
	require('./lib/myfunc')
	require('./message/msg')
	require('./index')
	nocache('./message/help', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	nocache('./lib/myfunc', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	nocache('./message/msg', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	nocache('./index', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	
	conn.ev.on('messages.upsert', async m => {
		if (!m.messages) return;
		var msg = m.messages[0]
		msg = serialize(conn, msg)
		msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
		require('./message/msg')(conn, msg, m, setting, store)
	})
	conn.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			status.stop()
			reconnect.stop()
			starting.stop()
			console.log(mylog('Server Ready ✓'))
			lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
			? connectToWhatsApp()
			: console.log(mylog('Wa web terlogout...'))
		}
	})
	conn.ev.on('creds.update', () => saveState)
	

	conn.ev.on('group-participants.update', async (data) => {
	try {
	let metadata = await conn.groupMetadata(data.id)
	  for (let i of data.participants) {
	  var randomlink = ["https://i.ibb.co/Kh3CHWJ/84dfef71e6fa.jpg","https://i.ibb.co/2hH6MRM/b5d1649992ad.jpg","https://i.ibb.co/7tH9Yhh/ad781e263b4d.jpg","https://i.ibb.co/NmrPXxm/8d37afc61265.jpg","https://i.ibb.co/fQ7xGrY/20149ca5ac56.jpg","https://i.ibb.co/gMxwzLr/122d5a8410e7.jpg"]
	  var acak = randomlink[Math.floor(Math.random() * randomlink.length)]
		try {
		  var pp_user = await conn.profilePictureUrl(i, 'image')
		} catch {
		  var pp_user = `https://i.ibb.co/fHjfjhp/7770c211fe27.jpg`
		}
		if (data.action == "add") {
		  var welcomenya = await getBuffer(`http://hadi-api.herokuapp.com/api/card/Welcome?nama=${i.split("@")[0]}&descriminator=JOJO-BOT&memcount=${metadata.participants.length}&gcname=${metadata.subject}&pp=${pp_user}&bg=${acak}`)
		   var but = [{buttonId: `/`, buttonText: { displayText: "Welcome 🥳" }, type: 1 }]
				conn.sendMessage(data.id, { caption: `Hallo @${i.split("@")[0]} Selamat Datang Di Grup *${metadata.subject}*\nSilahkan Untuk Memperkenalkan diri anda`, image: welcomenya, buttons: but, footer: `Welcome`, mentions: [i]})
		} else if (data.action == "remove") {
		  var leavenya = await getBuffer(`http://hadi-api.herokuapp.com/api/card/goodbye?nama=${i.split("@")[0]}&descriminator=JOJO-BOT&memcount=${metadata.participants.length}&gcname=${metadata.subject}&pp=${pp_user}&bg=https://i.ibb.co/kKtNYWk/f1fd4ff15270.jpg`)
		  var but = [{buttonId: `/`, buttonText: { displayText: "Good Bye 👋" }, type: 1 }]
				conn.sendMessage(data.id, { caption: `Byeee @${i.split("@")[0]}`, image: leavenya, buttons: but, footer: `Leave`, mentions: [i]})
		}
	  }
	} catch (e) {
	  console.log(e)
	}
  }
)

	
	conn.reply = (from, content, msg) => conn.sendMessage(from, { text: content }, { quoted: msg })

	return conn
}

connectToWhatsApp()
.catch(err => console.log(err))