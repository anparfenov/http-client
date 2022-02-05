type HttpErrorInitData = {
	status: number;
	message: string;
};

export class HttpError extends Error {
	public status: number = 200;

	constructor({ message, status }: HttpErrorInitData) {
		super(message);

		this.status = status;
	}
}
