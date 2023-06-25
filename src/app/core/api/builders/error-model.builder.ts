import { ErrorModel } from '../models';

export class ErrorModelBuilder {
    private errorModel: ErrorModel = new ErrorModel();

    public setStatus(status: number): ErrorModelBuilder {
        this.errorModel.statusCode = status;
        return this;
    }

    public setErrorCode(errorCode: string): ErrorModelBuilder {
        this.errorModel.errorCode = errorCode;
        return this;
    }

    public setMessage(message: string): ErrorModelBuilder {
        this.errorModel.errorMessage = message;
        return this;
    }

    public build(): ErrorModel {
        return this.errorModel;
    }
}
