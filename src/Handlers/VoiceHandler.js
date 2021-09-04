import {
  ChannnelResolver,
  BooleanResolver
} from '../Utilities/Resolver_Utils.js'
import { StageChannel, VoiceChannel, Client, Guild } from 'discord.js'
import { VoiceConnectionBuilder } from '../Structures/VoiceConnection.js'
import { Snowflake } from 'discord-api-types'

/**
 * @class VoiceHandler - Voice Handler for discord.js v13
 * @param {Client} Client Discord API Client from discord.js v13
 * @param {object} VoiceHandlerInterfaceOptions Voice handler Interface options for class VoiceHandler
 */

export class VoiceHandler {
  /**
   * @constructor VoiceHandler - Voice Handler for discord.js v13
   * @param {Client} Client Discord API Client from discord.js v13
   * @param {object} VoiceHandlerOptions Voice handler Interface options for class VoiceHandler
   */

  constructor (
    Client,
    VoiceHandlerInterfaceOptions = {
      LeaveOnEmpty: false,
      LeaveOnOnlyBot: false,
      LeaveOnOnlyUsers: false,
      LeaveDelay: 0,
      selfDeaf: false,
      selfMute: false
    }
  ) {
    this.Client = Client
    this.LeaveOnEmpty = VoiceHandlerInterfaceOptions.LeaveOnEmpty ? true : false
    this.LeaveOnOnlyBot = VoiceHandlerInterfaceOptions.LeaveOnOnlyBot
      ? true
      : false
    this.LeaveOnOnlyUsers = VoiceHandlerInterfaceOptions.LeaveOnOnlyUsers
      ? true
      : false
    this.LeaveDelay =
      VoiceHandlerInterfaceOptions.LeaveDelay > 0
        ? VoiceHandlerInterfaceOptions.LeaveDelay
        : 0
    this.selfDeaf = VoiceHandlerInterfaceOptions.selfDeaf ? true : false
    this.selfMute = VoiceHandlerInterfaceOptions.selfMute ? true : false
  }

  static #VoiceConnectionRecords = {}

  /**
   * @method join - Voice Handler for discord.js v13
   * @param {StageChannel | VoiceChannel} channel Discord API Client from discord.js v13
   * @param {object} JoinVoiceOptions Voice handler Interface options for class VoiceHandler
   * @return
   */

  async join (
    channel,
    JoinVoiceChannelOptions = {
      StageChannelTitle: `Voice Channel Handler - Jericho Framework`,
      debug: false,
      Adapter: null,
      LeaveOnEmpty: false,
      LeaveOnOnlyBot: false,
      LeaveOnOnlyUsers: false,
      LeaveDelay: 0,
      selfDeaf: false,
      selfMute: false
    }
  ) {
    if (!channel) throw SyntaxError(`Invalid Voice Type Channel is Detected !`)
    else channel = ChannnelResolver(this.Client, channel, { type: 'allvoice' })
    //Updating Class Properties
    JoinVoiceChannelOptions.LeaveOnEmpty = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty
    )
    JoinVoiceChannelOptions.LeaveOnOnlyBot = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty
    )
    JoinVoiceChannelOptions.LeaveOnOnlyUsers = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty
    )
    JoinVoiceChannelOptions.LeaveDelay =
      JoinVoiceChannelOptions.LeaveDelay > 0
        ? JoinVoiceChannelOptions.LeaveDelay
        : this.LeaveDelay
    JoinVoiceChannelOptions.selfDeaf = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty
    )
    JoinVoiceChannelOptions.selfMute = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty
    )

    const VoiceConnectionInstance = new VoiceConnectionBuilder(
      this.Client,
      channel,
      channel.guild,
      Adapter,
      {
        LeaveOnEmpty: this.LeaveOnEmpty,
        LeaveOnOnlyBot: this.LeaveOnOnlyBot,
        LeaveOnOnlyUsers: this.LeaveOnOnlyUsers,
        LeaveDelay: this.LeaveDelay,
        selfDeaf: this.selfDeaf,
        selfMute: this.selfMute
      }
    )
    VoiceConnectionInstance = VoiceConnectionInstance.create()
    return VoiceHandler.#RegisterVoiceConnection(
      channel.guild.id,
      VoiceConnectionInstance
    )
  }

  /**
   * @method disconnect Disconnect Voice Connection on Discord Server
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   */

  disconnect (GuildId) {
    const VoiceConnectionInstance = VoiceHandler.#GetVoiceConnection(GuildId)
    if (VoiceConnectionInstance && VoiceConnectionInstance.disconnect)
      throw Error(
        `[Connection is already Disconnected] : Please Connect to Channel`
      )
    else if (!VoiceConnectionInstance)
      throw Error(
        `[Connection is already Destroyed] : Please Connect to Channel`
      )
    VoiceConnectionInstance.disconnect()
  }

  /**
   * @method destroy Destroy Voice Connection on Discord Server
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   * @param {Boolean} AdapterAvailable Boolean Checker if Adaptar is Required
   */

  destroy (GuildId, AdapterAvailable = true) {
    const VoiceConnectionInstance = VoiceHandler.#GetVoiceConnection(GuildId)
    if (VoiceConnectionInstance && VoiceConnectionInstance.disconnect)
      throw Error(
        `[Connection is already Disconnected] : Please Connect to Channel`
      )
    else if (!VoiceConnectionInstance)
      throw Error(
        `[Connection is already Destroyed] : Please Connect to Channel`
      )
    VoiceConnectionInstance.destroy(AdapterAvailable)
    return VoiceHandler.#DestroyVoiceConnection(GuildId)
  }

  /**
   * @method get Getter Method for Voice Connection on Discord Server
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   */

  get (GuildId) {
    const VoiceConnectionInstance = VoiceHandler.#GetVoiceConnection(GuildId)
    if (!VoiceConnectionInstance)
      throw Error(
        `[Connection is already Destroyed] : Please Connect to Channel`
      )
    return VoiceConnectionInstance.get()
  }

  /**
   * @method #RegisterVoiceConnection Registration of Voice Connection on handler Class
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   * @param {object} VoiceConnectionInstance Builder Class Instance for Cache
   */

  static #RegisterVoiceConnection (GuildId, VoiceConnectionInstance) {
    VoiceHandler.#VoiceConnectionRecords[
      `"${GuildId}"`
    ] = VoiceConnectionInstance
    return VoiceConnectionInstance.VoiceConnection
  }

  /**
   * @method #GetVoiceConnection Getter Private Method Voice Connection for Cache in Handler Class
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   */

  static #GetVoiceConnection (GuildId) {
    return VoiceHandler.#VoiceConnectionRecords[`"${GuildId}"`]
  }

  /**
   * @method #DestroyVoiceConnection Destroy Private Method Voice Connection for Cache in Handler Class
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   */

  static #DestroyVoiceConnection (GuildId) {
    VoiceHandler.#VoiceConnectionRecords[`"${GuildId}"`] = null
    return true
  }
}
