class LocalStorageController {
	NAMESPACE: string = 'neoflix';
	constructor(namespace?: string) {
		this.NAMESPACE = namespace || this.NAMESPACE;
	}
	set(name: string, data: string) {
		return window.localStorage.setItem(`${this.NAMESPACE}_${name}`, data);
	}
	clear() {
		return window.localStorage.clear();
	}
	get(name: string) {
		return window.localStorage.getItem(`${this.NAMESPACE}_${name}`);
	}
	delete(name: string) {
		return window.localStorage.removeItem(`${this.NAMESPACE}_${name}`);
	}
}

export { LocalStorageController };
