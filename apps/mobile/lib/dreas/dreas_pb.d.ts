import * as $protobuf from "protobufjs";
import Long = require("long");

/** Namespace dreas. */
export namespace dreas {
  /**
   * Properties of a DREASRuleField.
   * @deprecated Use dreas.DREASRuleField.$Properties instead.
   */
  interface IDREASRuleField extends dreas.DREASRuleField.$Properties {}

  /** Represents a DREASRuleField. */
  class DREASRuleField {
    /**
     * Constructs a new DREASRuleField.
     * @param [properties] Properties to set
     */
    constructor(properties?: dreas.DREASRuleField.$Properties);

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[];

    /** DREASRuleField selector. */
    selector: string;

    /** DREASRuleField action. */
    action: string;

    /** DREASRuleField target. */
    target?: string | null;

    /** DREASRuleField regex. */
    regex?: string | null;

    /** DREASRuleField regexGroup. */
    regexGroup?: number | null;

    /**
     * Creates a new DREASRuleField instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DREASRuleField instance
     */
    static create(
      properties: dreas.DREASRuleField.$Shape,
    ): dreas.DREASRuleField & dreas.DREASRuleField.$Shape;
    static create(
      properties?: dreas.DREASRuleField.$Properties,
    ): dreas.DREASRuleField;

    /**
     * Encodes the specified DREASRuleField message. Does not implicitly {@link dreas.DREASRuleField.verify|verify} messages.
     * @param message DREASRuleField message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(
      message: dreas.DREASRuleField.$Properties,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified DREASRuleField message, length delimited. Does not implicitly {@link dreas.DREASRuleField.verify|verify} messages.
     * @param message DREASRuleField message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: dreas.DREASRuleField.$Properties,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a DREASRuleField message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {dreas.DREASRuleField & dreas.DREASRuleField.$Shape} DREASRuleField
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): dreas.DREASRuleField & dreas.DREASRuleField.$Shape;

    /**
     * Decodes a DREASRuleField message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {dreas.DREASRuleField & dreas.DREASRuleField.$Shape} DREASRuleField
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): dreas.DREASRuleField & dreas.DREASRuleField.$Shape;

    /**
     * Verifies a DREASRuleField message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a DREASRuleField message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DREASRuleField
     */
    static fromObject(object: { [k: string]: any }): dreas.DREASRuleField;

    /**
     * Creates a plain object from a DREASRuleField message. Also converts values to other types if specified.
     * @param message DREASRuleField
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: dreas.DREASRuleField,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this DREASRuleField to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any };

    /**
     * Gets the type url for DREASRuleField
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string;
  }

  namespace DREASRuleField {
    /** Properties of a DREASRuleField. */
    interface $Properties {
      /** DREASRuleField selector */
      selector?: string | null;

      /** DREASRuleField action */
      action?: string | null;

      /** DREASRuleField target */
      target?: string | null;

      /** DREASRuleField regex */
      regex?: string | null;

      /** DREASRuleField regexGroup */
      regexGroup?: number | null;

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[];
    }

    /** Shape of a DREASRuleField. */
    type $Shape = dreas.DREASRuleField.$Properties;
  }

  /**
   * Properties of a DREASRuleEndpoint.
   * @deprecated Use dreas.DREASRuleEndpoint.$Properties instead.
   */
  interface IDREASRuleEndpoint extends dreas.DREASRuleEndpoint.$Properties {}

  /** Represents a DREASRuleEndpoint. */
  class DREASRuleEndpoint {
    /**
     * Constructs a new DREASRuleEndpoint.
     * @param [properties] Properties to set
     */
    constructor(properties?: dreas.DREASRuleEndpoint.$Properties);

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[];

    /** DREASRuleEndpoint container. */
    container?: string | null;

    /** DREASRuleEndpoint limit. */
    limit?: number | null;

    /** DREASRuleEndpoint fields. */
    fields: { [k: string]: dreas.DREASRuleField.$Properties };

    /**
     * Creates a new DREASRuleEndpoint instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DREASRuleEndpoint instance
     */
    static create(
      properties: dreas.DREASRuleEndpoint.$Shape,
    ): dreas.DREASRuleEndpoint & dreas.DREASRuleEndpoint.$Shape;
    static create(
      properties?: dreas.DREASRuleEndpoint.$Properties,
    ): dreas.DREASRuleEndpoint;

    /**
     * Encodes the specified DREASRuleEndpoint message. Does not implicitly {@link dreas.DREASRuleEndpoint.verify|verify} messages.
     * @param message DREASRuleEndpoint message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(
      message: dreas.DREASRuleEndpoint.$Properties,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified DREASRuleEndpoint message, length delimited. Does not implicitly {@link dreas.DREASRuleEndpoint.verify|verify} messages.
     * @param message DREASRuleEndpoint message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: dreas.DREASRuleEndpoint.$Properties,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a DREASRuleEndpoint message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {dreas.DREASRuleEndpoint & dreas.DREASRuleEndpoint.$Shape} DREASRuleEndpoint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): dreas.DREASRuleEndpoint & dreas.DREASRuleEndpoint.$Shape;

    /**
     * Decodes a DREASRuleEndpoint message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {dreas.DREASRuleEndpoint & dreas.DREASRuleEndpoint.$Shape} DREASRuleEndpoint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): dreas.DREASRuleEndpoint & dreas.DREASRuleEndpoint.$Shape;

    /**
     * Verifies a DREASRuleEndpoint message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a DREASRuleEndpoint message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DREASRuleEndpoint
     */
    static fromObject(object: { [k: string]: any }): dreas.DREASRuleEndpoint;

    /**
     * Creates a plain object from a DREASRuleEndpoint message. Also converts values to other types if specified.
     * @param message DREASRuleEndpoint
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: dreas.DREASRuleEndpoint,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this DREASRuleEndpoint to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any };

    /**
     * Gets the type url for DREASRuleEndpoint
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string;
  }

  namespace DREASRuleEndpoint {
    /** Properties of a DREASRuleEndpoint. */
    interface $Properties {
      /** DREASRuleEndpoint container */
      container?: string | null;

      /** DREASRuleEndpoint limit */
      limit?: number | null;

      /** DREASRuleEndpoint fields */
      fields?: { [k: string]: dreas.DREASRuleField.$Properties } | null;

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[];
    }

    /** Shape of a DREASRuleEndpoint. */
    type $Shape = dreas.DREASRuleEndpoint.$Properties;
  }

  /**
   * Properties of a DREASExecutionConfig.
   * @deprecated Use dreas.DREASExecutionConfig.$Properties instead.
   */
  interface IDREASExecutionConfig
    extends dreas.DREASExecutionConfig.$Properties {}

  /** Represents a DREASExecutionConfig. */
  class DREASExecutionConfig {
    /**
     * Constructs a new DREASExecutionConfig.
     * @param [properties] Properties to set
     */
    constructor(properties?: dreas.DREASExecutionConfig.$Properties);

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[];

    /** DREASExecutionConfig antiBotStrategy. */
    antiBotStrategy: string;

    /** DREASExecutionConfig waitForElement. */
    waitForElement?: string | null;

    /** DREASExecutionConfig timeoutMs. */
    timeoutMs?: number | null;

    /** DREASExecutionConfig userAgentSpoof. */
    userAgentSpoof?: boolean | null;

    /**
     * Creates a new DREASExecutionConfig instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DREASExecutionConfig instance
     */
    static create(
      properties: dreas.DREASExecutionConfig.$Shape,
    ): dreas.DREASExecutionConfig & dreas.DREASExecutionConfig.$Shape;
    static create(
      properties?: dreas.DREASExecutionConfig.$Properties,
    ): dreas.DREASExecutionConfig;

    /**
     * Encodes the specified DREASExecutionConfig message. Does not implicitly {@link dreas.DREASExecutionConfig.verify|verify} messages.
     * @param message DREASExecutionConfig message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(
      message: dreas.DREASExecutionConfig.$Properties,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified DREASExecutionConfig message, length delimited. Does not implicitly {@link dreas.DREASExecutionConfig.verify|verify} messages.
     * @param message DREASExecutionConfig message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: dreas.DREASExecutionConfig.$Properties,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a DREASExecutionConfig message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {dreas.DREASExecutionConfig & dreas.DREASExecutionConfig.$Shape} DREASExecutionConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): dreas.DREASExecutionConfig & dreas.DREASExecutionConfig.$Shape;

    /**
     * Decodes a DREASExecutionConfig message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {dreas.DREASExecutionConfig & dreas.DREASExecutionConfig.$Shape} DREASExecutionConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): dreas.DREASExecutionConfig & dreas.DREASExecutionConfig.$Shape;

    /**
     * Verifies a DREASExecutionConfig message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a DREASExecutionConfig message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DREASExecutionConfig
     */
    static fromObject(object: { [k: string]: any }): dreas.DREASExecutionConfig;

    /**
     * Creates a plain object from a DREASExecutionConfig message. Also converts values to other types if specified.
     * @param message DREASExecutionConfig
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: dreas.DREASExecutionConfig,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this DREASExecutionConfig to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any };

    /**
     * Gets the type url for DREASExecutionConfig
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string;
  }

  namespace DREASExecutionConfig {
    /** Properties of a DREASExecutionConfig. */
    interface $Properties {
      /** DREASExecutionConfig antiBotStrategy */
      antiBotStrategy?: string | null;

      /** DREASExecutionConfig waitForElement */
      waitForElement?: string | null;

      /** DREASExecutionConfig timeoutMs */
      timeoutMs?: number | null;

      /** DREASExecutionConfig userAgentSpoof */
      userAgentSpoof?: boolean | null;

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[];
    }

    /** Shape of a DREASExecutionConfig. */
    type $Shape = dreas.DREASExecutionConfig.$Properties;
  }

  /**
   * Properties of a DREASManifest.
   * @deprecated Use dreas.DREASManifest.$Properties instead.
   */
  interface IDREASManifest extends dreas.DREASManifest.$Properties {}

  /** Represents a DREASManifest. */
  class DREASManifest {
    /**
     * Constructs a new DREASManifest.
     * @param [properties] Properties to set
     */
    constructor(properties?: dreas.DREASManifest.$Properties);

    /** Unknown fields preserved while decoding */
    $unknowns?: Uint8Array[];

    /** DREASManifest providerId. */
    providerId: string;

    /** DREASManifest ruleVersion. */
    ruleVersion: string;

    /** DREASManifest minCoreVersion. */
    minCoreVersion: string;

    /** DREASManifest executionConfig. */
    executionConfig?: dreas.DREASExecutionConfig.$Properties | null;

    /** DREASManifest rules. */
    rules: { [k: string]: dreas.DREASRuleEndpoint.$Properties };

    /**
     * Creates a new DREASManifest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DREASManifest instance
     */
    static create(
      properties: dreas.DREASManifest.$Shape,
    ): dreas.DREASManifest & dreas.DREASManifest.$Shape;
    static create(
      properties?: dreas.DREASManifest.$Properties,
    ): dreas.DREASManifest;

    /**
     * Encodes the specified DREASManifest message. Does not implicitly {@link dreas.DREASManifest.verify|verify} messages.
     * @param message DREASManifest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(
      message: dreas.DREASManifest.$Properties,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified DREASManifest message, length delimited. Does not implicitly {@link dreas.DREASManifest.verify|verify} messages.
     * @param message DREASManifest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(
      message: dreas.DREASManifest.$Properties,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a DREASManifest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {dreas.DREASManifest & dreas.DREASManifest.$Shape} DREASManifest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): dreas.DREASManifest & dreas.DREASManifest.$Shape;

    /**
     * Decodes a DREASManifest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {dreas.DREASManifest & dreas.DREASManifest.$Shape} DREASManifest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): dreas.DREASManifest & dreas.DREASManifest.$Shape;

    /**
     * Verifies a DREASManifest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a DREASManifest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DREASManifest
     */
    static fromObject(object: { [k: string]: any }): dreas.DREASManifest;

    /**
     * Creates a plain object from a DREASManifest message. Also converts values to other types if specified.
     * @param message DREASManifest
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(
      message: dreas.DREASManifest,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this DREASManifest to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any };

    /**
     * Gets the type url for DREASManifest
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string;
  }

  namespace DREASManifest {
    /** Properties of a DREASManifest. */
    interface $Properties {
      /** DREASManifest providerId */
      providerId?: string | null;

      /** DREASManifest ruleVersion */
      ruleVersion?: string | null;

      /** DREASManifest minCoreVersion */
      minCoreVersion?: string | null;

      /** DREASManifest executionConfig */
      executionConfig?: dreas.DREASExecutionConfig.$Properties | null;

      /** DREASManifest rules */
      rules?: { [k: string]: dreas.DREASRuleEndpoint.$Properties } | null;

      /** Unknown fields preserved while decoding */
      $unknowns?: Uint8Array[];
    }

    /** Shape of a DREASManifest. */
    type $Shape = dreas.DREASManifest.$Properties;
  }
}
