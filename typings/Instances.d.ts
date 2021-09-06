import {
  ApplicationCommand,
  Channel,
  Client,
  Guild,
  Message,
  Snowflake,
  ThreadChannel
} from 'discord.js'

export type ThreadInstance = {
  readonly ThreadCode: Number
  readonly Client: Client
  readonly channel: Channel
  readonly guild: Guild
  metadata: any | 'Anything to Cache for ThreadInstance'
  readonly thread: ThreadChannel
  create(CreateThreadOptions: {
    channel: Channel
    metadata: any | 'Anything to Cache for ThreadInstance'
    Type: String
    Name: String
    Reason: String
    AutoArchiveDuration: Number
  }): Promise<ThreadInstance> | undefined
  destroy(DestroyThreadOptions: {
    Delay: Number
    Reason: String
  }): Boolean | undefined
}

export type SlashCommandHandlerInstance = {
  readonly client: Client
  readonly guild: Guild | Message | Channel | Snowflake | String
  readonly global: Boolean
  readonly SlashCommands: Array<ApplicationCommand>
  readonly ApplicationCommands: Array<ApplicationCommand>
  set(commands: []): Promise<ApplicationCommand> | undefined
  deploy(): Promise<SlashCommandHandlerInstance> | undefined
  get(
    CommandId: Number | Snowflake | String
  ): Promise<ApplicationCommand> | undefined
  destroy(
    CommandId: Number | Snowflake | String
  ): Array<Promise<ApplicationCommand>> | undefined
}
