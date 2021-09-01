/**
 * @class ThreadBuilder is the Class to Operate Particular Threads in Same Channel Respective Server
 * @param {Object} Options Options Values for Particular Channel Instance
 * @returns {Object} A Class Instance of Single Channel [ Unique Instance ]
 */

export class ThreadBuilder {

    /**
     * @property {Number} ThreadInstanceNumber : For Storing Instance Numbers for further Utils Requirements
     */

    static #ThreadInstanceNumber = 0;

    /**
     * @constructor 
     * @property {Snowflake} Client Discord API Client from discord.js v13
     * @property {Number} ThreadCode Thread-main Channel's Code for Instance get method
     * @property {Snowflake} channel Channel Resolve from Discord.js v13
     * @property {Snowflake} guild Guild Resolve from Discord.js v13
     * @property {Object} metadata Extra Stuff to check or Cache Data
     * @property {Snowflake} thread Thread Snowflake from Discord API v9
     */

    constructor(Options) {
        this.Client = Options.Client;
        this.ThreadCode = ThreadBuilder.#ThreadInstanceNumber + 1;
        this.channel = Options.channel;
        this.guild = Options.guild;
        this.metadata = Options.metadata;
        this.thread = null;
    };

    /**
     * @method CreateInstance Method for Creating Instance for the particular Channel
     * @param {Object} Options Options for Name , AutoArchive Duration , Reason , Type .
     * @returns {Object} Thread Instance for Thread-Handler Class .
     */

    async create(Options) {
        if (!Options) throw TypeError(`Invalid Options Detected for Thread Creator`);
        else if (Options.Type && !['private', 'public'].includes(`${Options.Type.toLowerCase().trim()}`)) throw TypeError(`Invalid Thread Type is Detected!`);
        const Thread = await this.channel.threads.create({
            name: Options.Name ? Options.Name : `Thread Instance - ${this.ThreadInstances + 1} | Jericho Framework`,
            autoArchiveDuration: Options.AutoArchiveDuration ? Options.AutoArchiveDuration : 60,
            type: Options.Type === 'private' ? 'GUILD_PRIVATE_THREAD' : `GUILD_PUBLIC_THREAD`,
            reason: Options.Reason ? Options.Reason : `Thread Created by ${this.Client.user.name} on Thread Handler | Jericho Framework`,
        }).catch(error => {
            throw error;
        });
        this.thread = Thread;
        return this;
    };

    /**
     * @method DestroyInstance Destroy Particular Instance Completely from Thread Class
     * @param {Object} Options Options for Delay Destroy
     * @returns {boolean} ture/false Wheather the Condition is working
     */

    destroy(Options) {
        if (!Options) throw SyntaxError(`Options Variable can't be Undefined , Reason is Compulsory`);
        if (Options.Delay && !Number.isNaN(Options.Delay) && Options.Reason) return setTimeout(ThreadDeletion(this.thread, Options.Reason), parseInt(Options.Delay) * 1000);
        else if (Options.Reason) return ThreadDeletion(this.thread, Options.Reason);
        else throw SyntaxError(`Options Variable can't be Undefined , Reason is Compulsory`);

        function ThreadDeletion(Thread, Reason) {
            return Thread.delete(`${Reason ? Reason : `Deleted Thread Instance}`}`).then(() => {
                return true;
            }).catch(error => {
                throw error;
            });
        };
    };
}