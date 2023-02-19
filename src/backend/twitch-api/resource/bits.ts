import logger from "../../logwrapper";
import accountAccess from "../../common/account-access";
import { ApiClient, HelixBitsLeaderboardEntry, HelixBitsLeaderboardPeriod, HelixBitsLeaderboardQuery } from "@twurple/api";

export class TwitchBitsApi {
    client: ApiClient;

    constructor(apiClient: ApiClient) {
        this.client = apiClient;
    }

    async getChannelBitsLeaderboard(
        count: number = 10,
        period: HelixBitsLeaderboardPeriod = "all",
        startDate: Date = new Date(),
        userId?: string
    ): Promise<HelixBitsLeaderboardEntry[]> {
        const streamerId: string = accountAccess.getAccounts().streamer.userId;
        const leaderboard: HelixBitsLeaderboardEntry[] = [];
    
        try {
            const params: HelixBitsLeaderboardQuery = {
                count: count,
                period: period,
                startDate: startDate,
                contextUserId: userId
            };
            leaderboard.push(...(await this.client.bits.getLeaderboard(streamerId, params)).entries);
        } catch (error) {
            logger.error("Failed to get channel bits leaderboard", error);
        }
    
        return leaderboard;
    }
    
    async getChannelBitsTopCheerers(
        count: number = 1,
        period: HelixBitsLeaderboardPeriod = "all",
        startDate: Date = new Date()
    ): Promise<String[]> {
        const leaderboard = await this.getChannelBitsLeaderboard(count, period, startDate);
    
        return leaderboard.map(l => {
            return l.userName
        })
    }
};