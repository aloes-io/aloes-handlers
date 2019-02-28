module.exports = {
	title: 'Aloes - Handlers',
	base: '/aloes-handlers/',
	dest: 'public',
	themeConfig: {
		logo: '/logo.png',
		repo: 'https://framagit.org/aloes/aloes-handlers',
		repoLabel: 'Git',
		docsDir: 'docs',
		nav: [{text: 'Readme', link: '/readme/'}, {text: 'Core', link: '/api/'}],
		sidebar: [
			['/readme/', 'Readme'],
			['/api/', 'Core'],
			['/aloesclient/', 'AloesClient'],
			['/aloeslight/', 'AloesLight'],
			['/cayennelpp/', 'CayenneLPP'],
			['/mysensors/', 'MySensors'],
		],
		serviceWorker: {
			updatePopup: true, // Boolean | Object, default to undefined.
			// If set to true, the default text config will be:
			// updatePopup: {
			//    message: "New content is available.",
			//    buttonText: "Refresh"
			// }
		},
	},
};
