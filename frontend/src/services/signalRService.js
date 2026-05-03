import * as signalR from '@microsoft/signalr';

const HUB_URL = 'https://localhost:7092/chatHub';

class SignalRService {
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL)
            .withAutomaticReconnect()
            .build();
    }

    async startConnection() {
        if (this.connection.state === signalR.HubConnectionState.Disconnected) {
            try {
                await this.connection.start();
                console.log("SignalR Connected.");
            } catch (err) {
                console.error("SignalR Connection Error: ", err);
                // Optionally retry connection after a timeout
                setTimeout(() => this.startConnection(), 5000);
            }
        }
    }

    async joinChatRoom(cuocTroChuyenId) {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
            try {
                await this.connection.invoke("JoinChatRoom", parseInt(cuocTroChuyenId));
                console.log(`Joined chat room: Room_${cuocTroChuyenId}`);
            } catch (err) {
                console.error("Error joining chat room:", err);
            }
        } else {
            console.warn("Cannot join room, SignalR is not connected.");
        }
    }

    async sendMessage(cuocTroChuyenId, nguoiDungId, message) {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
            try {
                await this.connection.invoke("SendMessage", parseInt(cuocTroChuyenId), parseInt(nguoiDungId), message);
            } catch (err) {
                console.error("Error sending message:", err);
                throw err;
            }
        } else {
            console.error("Cannot send message, SignalR is not connected.");
            throw new Error("SignalR not connected");
        }
    }

    onReceiveMessage(callback) {
        // Ensure we don't attach multiple identical handlers
        this.connection.off("ReceiveMessage");
        this.connection.on("ReceiveMessage", (cuocTroChuyenId, nguoiDungId, noiDung, thoiGian) => {
            const message = {
                id_Message: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Temporary ID for React key
                ql_cuoc_tro_chuyen_id: cuocTroChuyenId,
                id_User: nguoiDungId,
                noi_Dung: noiDung,
                thoi_Gian: thoiGian
            };
            callback(message);
        });
    }

    offReceiveMessage() {
        this.connection.off("ReceiveMessage");
    }
}

// Export as singleton
const signalRService = new SignalRService();
export default signalRService;
