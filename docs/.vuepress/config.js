module.exports = {
	title: 'Aloes - Handlers',
	base: '/aloes-handlers/',
	dest: 'public',
	themeConfig: {
		logo: '/logo.png',
		repo: 'https://framagit.org/aloes/aloes-handlers',
		repoLabel: 'Git',
		docsDir: 'docs',
		nav: [{text: 'AloesClient', link: '/aloesclient/'}],
		sidebar: [['/readme/', 'Readme'], ['/aloesclient/', 'AloesClient']],
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
