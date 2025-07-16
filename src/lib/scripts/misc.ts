class Events {
	private events: any = {};

	on(name: string, callback: (...args: any) => void) {
		if (!this.events[name]) {
			this.events[name] = [];
		}
		this.events[name].push(callback);
	}
	remove(name: string, callback: () => void) {
		if (this.events[name] && this.events.length > 0) {
			this.events.filter((e: () => void) => e !== callback);

			if (this.events[name].length === 0) delete this.events[name];
		}
	}
	dispatch(name: string, data?: any) {
		if (this.events[name])
			for (let x = 0; x < this.events[name].length; x++) {
				this.events[name][x](data);
			}
	}
}

export { Events };
