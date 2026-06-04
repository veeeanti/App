import type { BooruTypeObj } from '~/assets/lib/dist/src/util/BooruUtils'

export interface DomainConfig {
  options?: {
    HTTPScheme?: string
  } & Record<string, unknown>
}

export interface Domain {
  domain: string

  type: BooruTypeObj

  config: DomainConfig | null

  isPremium: boolean
  isCustom: boolean
}
