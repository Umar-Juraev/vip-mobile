const SYSTEM_NAME = 'vip-mobile'

class CacheKey {
  static readonly ACTIVE_LANG_NAME = `${SYSTEM_NAME}-active-lang-name-key`
  static readonly AUTH_TOKEN = `${SYSTEM_NAME}-auth-token`
  static readonly BARCODE_VALUE = `${SYSTEM_NAME}-barcode-value`
  static readonly INFO = `${SYSTEM_NAME}-user-info`
  static readonly PRINT_HOST = `${SYSTEM_NAME}-printer-host`
  static readonly PRINT_PORT = `${SYSTEM_NAME}-printer-port`
  static readonly BOX = `${SYSTEM_NAME}-box`
  static readonly TRACKING_SCANNER_VISIBLE = `${SYSTEM_NAME}-is-tracking-view-visible`
}

export default CacheKey
