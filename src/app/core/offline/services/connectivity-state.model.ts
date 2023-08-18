import { ConnectionType } from '../connection.type';

export class ConnectivityState {
    public constructor(public connectionType: ConnectionType) {}
    public get isConnected(): boolean | undefined {
        switch (this.connectionType) {
            case 'unknown':
                return true;
            case 'none':
                return false;
            default:
                return true;
        }
    }
}
