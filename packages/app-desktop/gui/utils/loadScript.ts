import Logger from '@joplin/lib/Logger';

const logger = Logger.create('loadScript');

export interface Script {
	id: string;
	src: string;
	attrs?: Record<string, any>;
}

export const loadScript = async (script: Script) => {
	return new Promise((resolve) => {
		let element: any = document.getElementById(script.id);

		if (element) {
			if (element.href === script.src || element.src === script.src) {
				logger.info(`Trying to load a script that has already been loaded: ${JSON.stringify(script)} - skipping it`);
				resolve(null);
			} else {
				logger.info(`Source of script has changed - reloading it: ${JSON.stringify(script)}`);
				element.parentNode.removeChild(element);
				element = null;
			}
		}

		if (script.src.indexOf('.css') >= 0) {
			element = document.createElement('link');
			element.rel = 'stylesheet';
			element.href = script.src;
		} else {
			element = document.createElement('script');
			element.src = script.src;
			if (script.attrs) {
				for (const attr in script.attrs) {
					element[attr] = script.attrs[attr];
				}
			}
		}

		element.id = script.id;

		element.onload = () => {
			resolve(null);
		};

		document.getElementsByTagName('head')[0].appendChild(element);
	});
};
