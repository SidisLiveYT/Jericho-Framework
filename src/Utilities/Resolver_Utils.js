/**
 * @exports ChannnelResolver Custom Resolvable for Guild | Channel | Message
 * @param {*} Client Discord API Client from discord.js v13 [ new Client() ]
 * @param {*} ChannelResolve Raw Data to be Resolved
 * @param {*} Extraif Extra Options for Resolver 
 * @returns {*} Returns the Correct Resolve Name of the Structure in terms of discord.js v13
 */

export async function ChannnelResolver(Client, ChannelResolve, Extraif) {
    if (Extraif.ifmessage && ChannelResolve.channel) return ChannelFilterType(ChannelResolve.channel, Extraif);
    else if (!isNaN(`${ChannelResolve}`)) {
        if (Client.channels.cache.get(`${ChannelResolve}`)) return ChannelFilterType(Client.channels.cache.get(`${ChannelResolve}`), Extraif);
        else return await Client.channels.fetch(`${ChannelResolve}`).then(Channel => {
            return ChannelFilterType(Channel, Extraif);
        }).catch(error => {
            throw TypeError(`Invalid Channel.id : ${error}`);
        });
    } else if (isNaN(`${ChannelResolve}`)) {
        if (Client.channels.cache.get(`${ChannelResolve}`)) return ChannelFilterType(Client.channels.cache.get(`${ChannelResolve}`), Extraif);
        else return await Client.channels.fetch(`${ChannelResolve}`).then(Channel => {
            return ChannelFilterType(Channel, Extraif);
        }).catch(error => {
            throw TypeError(`Invalid Channel.id : ${error}`);
        });
    } else return ChannelFilterType(ChannelResolve, Extraif);


    /**
     * @function ChannelFilterType Returning the Channel Type After Getting Accurate Resolve form Source
     * @param {*} Channel Filtered Data in the Process to be checked Perfectly
     * @param {*} Extraif Extra Options for Checking Type if 
     * @returns {*} Channel's Data to the Source
     */

    function ChannelFilterType(Channel, Extraif) {
        if (Channel.type === `GUILD_PUBLIC_THREAD` || Channel.type === `GUILD_PRIVATE_THREAD` || Channel.type === `GUILD_TEXT` || Channel.type === `GUILD_VOICE` || Channel.type === `GUILD_STAGE_VOICE`) {
            if (Extraif && Extraif.type === 'publicthread' && Channel.type === `GUILD_PUBLIC_THREAD`) return Channel;
            else if (Extraif && Extraif.type === 'privatethread' && Channel.type === `GUILD_PRIVATE_THREAD`) return Channel;
            else if (Extraif && Extraif.type === 'thread' && Channel.isThread()) return Channel;
            else if (Extraif && Extraif.type === 'stage' && Channel.type === `GUILD_STAGE_VOICE`) return Channel;
            else if (Extraif && Extraif.type === 'voice' && Channel.isVoice()) return Channel;
            else if (Extraif && Extraif.type === 'text' && Channel.type === `GUILD_TEXT`) return Channel;
            else return Channel;
        } else throw SyntaxError(`[Wrong Channel Resolve] : Provide Channel.id or Channel Collection of discord.js v13`);
    };
};