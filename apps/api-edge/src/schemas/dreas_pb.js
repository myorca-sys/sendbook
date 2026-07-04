/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader,
  $Writer = $protobuf.Writer,
  $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const dreas = ($root.dreas = (() => {
  /**
   * Namespace dreas.
   * @exports dreas
   * @namespace
   */
  const dreas = {};

  dreas.DREASRuleField = (function () {
    /**
     * Properties of a DREASRuleField.
     * @typedef {Object} dreas.DREASRuleField.$Properties
     * @property {string|null} [selector] DREASRuleField selector
     * @property {string|null} [action] DREASRuleField action
     * @property {string|null} [target] DREASRuleField target
     * @property {string|null} [regex] DREASRuleField regex
     * @property {number|null} [regexGroup] DREASRuleField regexGroup
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */

    /**
     * Properties of a DREASRuleField.
     * @memberof dreas
     * @interface IDREASRuleField
     * @augments dreas.DREASRuleField.$Properties
     * @deprecated Use dreas.DREASRuleField.$Properties instead.
     */

    /**
     * Shape of a DREASRuleField.
     * @typedef {dreas.DREASRuleField.$Properties} dreas.DREASRuleField.$Shape
     */

    /**
     * Constructs a new DREASRuleField.
     * @memberof dreas
     * @classdesc Represents a DREASRuleField.
     * @constructor
     * @param {dreas.DREASRuleField.$Properties=} [properties] Properties to set
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */
    function DREASRuleField(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null && keys[i] !== "__proto__")
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * DREASRuleField selector.
     * @member {string} selector
     * @memberof dreas.DREASRuleField
     * @instance
     */
    DREASRuleField.prototype.selector = "";

    /**
     * DREASRuleField action.
     * @member {string} action
     * @memberof dreas.DREASRuleField
     * @instance
     */
    DREASRuleField.prototype.action = "";

    /**
     * DREASRuleField target.
     * @member {string|null|undefined} target
     * @memberof dreas.DREASRuleField
     * @instance
     */
    DREASRuleField.prototype.target = null;

    /**
     * DREASRuleField regex.
     * @member {string|null|undefined} regex
     * @memberof dreas.DREASRuleField
     * @instance
     */
    DREASRuleField.prototype.regex = null;

    /**
     * DREASRuleField regexGroup.
     * @member {number|null|undefined} regexGroup
     * @memberof dreas.DREASRuleField
     * @instance
     */
    DREASRuleField.prototype.regexGroup = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(DREASRuleField.prototype, "_target", {
      get: $util.oneOfGetter(($oneOfFields = ["target"])),
      set: $util.oneOfSetter($oneOfFields),
    });

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(DREASRuleField.prototype, "_regex", {
      get: $util.oneOfGetter(($oneOfFields = ["regex"])),
      set: $util.oneOfSetter($oneOfFields),
    });

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(DREASRuleField.prototype, "_regexGroup", {
      get: $util.oneOfGetter(($oneOfFields = ["regexGroup"])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * Creates a new DREASRuleField instance using the specified properties.
     * @function create
     * @memberof dreas.DREASRuleField
     * @static
     * @param {dreas.DREASRuleField.$Properties=} [properties] Properties to set
     * @returns {dreas.DREASRuleField} DREASRuleField instance
     * @type {{
     *   (properties: dreas.DREASRuleField.$Shape): dreas.DREASRuleField & dreas.DREASRuleField.$Shape;
     *   (properties?: dreas.DREASRuleField.$Properties): dreas.DREASRuleField;
     * }}
     */
    DREASRuleField.create = function create(properties) {
      return new DREASRuleField(properties);
    };

    /**
     * Encodes the specified DREASRuleField message. Does not implicitly {@link dreas.DREASRuleField.verify|verify} messages.
     * @function encode
     * @memberof dreas.DREASRuleField
     * @static
     * @param {dreas.DREASRuleField.$Properties} message DREASRuleField message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DREASRuleField.encode = function encode(message, writer, _depth) {
      if (!writer) writer = $Writer.create();
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) throw Error("max depth exceeded");
      if (
        message.selector != null &&
        Object.hasOwnProperty.call(message, "selector")
      )
        writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.selector);
      if (
        message.action != null &&
        Object.hasOwnProperty.call(message, "action")
      )
        writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.action);
      if (
        message.target != null &&
        Object.hasOwnProperty.call(message, "target")
      )
        writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.target);
      if (message.regex != null && Object.hasOwnProperty.call(message, "regex"))
        writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.regex);
      if (
        message.regexGroup != null &&
        Object.hasOwnProperty.call(message, "regexGroup")
      )
        writer.uint32(/* id 5, wireType 0 =*/ 40).int32(message.regexGroup);
      if (
        message.$unknowns != null &&
        Object.hasOwnProperty.call(message, "$unknowns")
      )
        for (let i = 0; i < message.$unknowns.length; ++i)
          writer.raw(message.$unknowns[i]);
      return writer;
    };

    /**
     * Encodes the specified DREASRuleField message, length delimited. Does not implicitly {@link dreas.DREASRuleField.verify|verify} messages.
     * @function encodeDelimited
     * @memberof dreas.DREASRuleField
     * @static
     * @param {dreas.DREASRuleField.$Properties} message DREASRuleField message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DREASRuleField.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(
        message,
        writer && writer.len ? writer.fork() : writer,
      ).ldelim();
    };

    /**
     * Decodes a DREASRuleField message from the specified reader or buffer.
     * @function decode
     * @memberof dreas.DREASRuleField
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {dreas.DREASRuleField & dreas.DREASRuleField.$Shape} DREASRuleField
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DREASRuleField.decode = function decode(
      reader,
      length,
      _end,
      _depth,
      _target,
    ) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      if (_depth === undefined) _depth = 0;
      if (_depth > $Reader.recursionLimit) throw Error("max depth exceeded");
      let end = length === undefined ? reader.len : reader.pos + length,
        message = _target || new $root.dreas.DREASRuleField(),
        value;
      while (reader.pos < end) {
        let start = reader.pos;
        let tag = reader.tag();
        if (tag === _end) {
          _end = undefined;
          break;
        }
        let wireType = tag & 7;
        switch ((tag >>>= 3)) {
          case 1: {
            if (wireType !== 2) break;
            if ((value = reader.string()).length) message.selector = value;
            else delete message.selector;
            continue;
          }
          case 2: {
            if (wireType !== 2) break;
            if ((value = reader.string()).length) message.action = value;
            else delete message.action;
            continue;
          }
          case 3: {
            if (wireType !== 2) break;
            message.target = reader.string();
            message._target = "target";
            continue;
          }
          case 4: {
            if (wireType !== 2) break;
            message.regex = reader.string();
            message._regex = "regex";
            continue;
          }
          case 5: {
            if (wireType !== 0) break;
            message.regexGroup = reader.int32();
            message._regexGroup = "regexGroup";
            continue;
          }
        }
        reader.skipType(wireType, _depth, tag);
        if (!reader.discardUnknown) {
          $util.makeProp(message, "$unknowns", false);
          (message.$unknowns || (message.$unknowns = [])).push(
            reader.raw(start, reader.pos),
          );
        }
      }
      if (_end !== undefined) throw Error("missing end group");
      return message;
    };

    /**
     * Decodes a DREASRuleField message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof dreas.DREASRuleField
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {dreas.DREASRuleField & dreas.DREASRuleField.$Shape} DREASRuleField
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DREASRuleField.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DREASRuleField message.
     * @function verify
     * @memberof dreas.DREASRuleField
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DREASRuleField.verify = function verify(message, _depth) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) return "max depth exceeded";
      let properties = {};
      if (message.selector != null && message.hasOwnProperty("selector"))
        if (!$util.isString(message.selector))
          return "selector: string expected";
      if (message.action != null && message.hasOwnProperty("action"))
        if (!$util.isString(message.action)) return "action: string expected";
      if (message.target != null && message.hasOwnProperty("target")) {
        properties._target = 1;
        if (!$util.isString(message.target)) return "target: string expected";
      }
      if (message.regex != null && message.hasOwnProperty("regex")) {
        properties._regex = 1;
        if (!$util.isString(message.regex)) return "regex: string expected";
      }
      if (message.regexGroup != null && message.hasOwnProperty("regexGroup")) {
        properties._regexGroup = 1;
        if (!$util.isInteger(message.regexGroup))
          return "regexGroup: integer expected";
      }
      return null;
    };

    /**
     * Creates a DREASRuleField message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof dreas.DREASRuleField
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {dreas.DREASRuleField} DREASRuleField
     */
    DREASRuleField.fromObject = function fromObject(object, _depth) {
      if (object instanceof $root.dreas.DREASRuleField) return object;
      if (!$util.isObject(object))
        throw TypeError(".dreas.DREASRuleField: object expected");
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) throw Error("max depth exceeded");
      let message = new $root.dreas.DREASRuleField();
      if (object.selector != null)
        if (typeof object.selector !== "string" || object.selector.length)
          message.selector = String(object.selector);
      if (object.action != null)
        if (typeof object.action !== "string" || object.action.length)
          message.action = String(object.action);
      if (object.target != null) message.target = String(object.target);
      if (object.regex != null) message.regex = String(object.regex);
      if (object.regexGroup != null) message.regexGroup = object.regexGroup | 0;
      return message;
    };

    /**
     * Creates a plain object from a DREASRuleField message. Also converts values to other types if specified.
     * @function toObject
     * @memberof dreas.DREASRuleField
     * @static
     * @param {dreas.DREASRuleField} message DREASRuleField
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DREASRuleField.toObject = function toObject(message, options, _depth) {
      if (!options) options = {};
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) throw Error("max depth exceeded");
      let object = {};
      if (options.defaults) {
        object.selector = "";
        object.action = "";
      }
      if (message.selector != null && message.hasOwnProperty("selector"))
        object.selector = message.selector;
      if (message.action != null && message.hasOwnProperty("action"))
        object.action = message.action;
      if (message.target != null && message.hasOwnProperty("target"))
        object.target = message.target;
      if (message.regex != null && message.hasOwnProperty("regex"))
        object.regex = message.regex;
      if (message.regexGroup != null && message.hasOwnProperty("regexGroup"))
        object.regexGroup = message.regexGroup;
      return object;
    };

    /**
     * Converts this DREASRuleField to JSON.
     * @function toJSON
     * @memberof dreas.DREASRuleField
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DREASRuleField.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the type url for DREASRuleField
     * @function getTypeUrl
     * @memberof dreas.DREASRuleField
     * @static
     * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns {string} The type url
     */
    DREASRuleField.getTypeUrl = function getTypeUrl(prefix) {
      if (prefix === undefined) prefix = "type.googleapis.com";
      return prefix + "/dreas.DREASRuleField";
    };

    return DREASRuleField;
  })();

  dreas.DREASRuleEndpoint = (function () {
    /**
     * Properties of a DREASRuleEndpoint.
     * @typedef {Object} dreas.DREASRuleEndpoint.$Properties
     * @property {string|null} [container] DREASRuleEndpoint container
     * @property {number|null} [limit] DREASRuleEndpoint limit
     * @property {Object.<string,dreas.DREASRuleField.$Properties>|null} [fields] DREASRuleEndpoint fields
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */

    /**
     * Properties of a DREASRuleEndpoint.
     * @memberof dreas
     * @interface IDREASRuleEndpoint
     * @augments dreas.DREASRuleEndpoint.$Properties
     * @deprecated Use dreas.DREASRuleEndpoint.$Properties instead.
     */

    /**
     * Shape of a DREASRuleEndpoint.
     * @typedef {dreas.DREASRuleEndpoint.$Properties} dreas.DREASRuleEndpoint.$Shape
     */

    /**
     * Constructs a new DREASRuleEndpoint.
     * @memberof dreas
     * @classdesc Represents a DREASRuleEndpoint.
     * @constructor
     * @param {dreas.DREASRuleEndpoint.$Properties=} [properties] Properties to set
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */
    function DREASRuleEndpoint(properties) {
      this.fields = {};
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null && keys[i] !== "__proto__")
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * DREASRuleEndpoint container.
     * @member {string|null|undefined} container
     * @memberof dreas.DREASRuleEndpoint
     * @instance
     */
    DREASRuleEndpoint.prototype.container = null;

    /**
     * DREASRuleEndpoint limit.
     * @member {number|null|undefined} limit
     * @memberof dreas.DREASRuleEndpoint
     * @instance
     */
    DREASRuleEndpoint.prototype.limit = null;

    /**
     * DREASRuleEndpoint fields.
     * @member {Object.<string,dreas.DREASRuleField.$Properties>} fields
     * @memberof dreas.DREASRuleEndpoint
     * @instance
     */
    DREASRuleEndpoint.prototype.fields = $util.emptyObject;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(DREASRuleEndpoint.prototype, "_container", {
      get: $util.oneOfGetter(($oneOfFields = ["container"])),
      set: $util.oneOfSetter($oneOfFields),
    });

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(DREASRuleEndpoint.prototype, "_limit", {
      get: $util.oneOfGetter(($oneOfFields = ["limit"])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * Creates a new DREASRuleEndpoint instance using the specified properties.
     * @function create
     * @memberof dreas.DREASRuleEndpoint
     * @static
     * @param {dreas.DREASRuleEndpoint.$Properties=} [properties] Properties to set
     * @returns {dreas.DREASRuleEndpoint} DREASRuleEndpoint instance
     * @type {{
     *   (properties: dreas.DREASRuleEndpoint.$Shape): dreas.DREASRuleEndpoint & dreas.DREASRuleEndpoint.$Shape;
     *   (properties?: dreas.DREASRuleEndpoint.$Properties): dreas.DREASRuleEndpoint;
     * }}
     */
    DREASRuleEndpoint.create = function create(properties) {
      return new DREASRuleEndpoint(properties);
    };

    /**
     * Encodes the specified DREASRuleEndpoint message. Does not implicitly {@link dreas.DREASRuleEndpoint.verify|verify} messages.
     * @function encode
     * @memberof dreas.DREASRuleEndpoint
     * @static
     * @param {dreas.DREASRuleEndpoint.$Properties} message DREASRuleEndpoint message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DREASRuleEndpoint.encode = function encode(message, writer, _depth) {
      if (!writer) writer = $Writer.create();
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) throw Error("max depth exceeded");
      if (
        message.container != null &&
        Object.hasOwnProperty.call(message, "container")
      )
        writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.container);
      if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
        writer.uint32(/* id 2, wireType 0 =*/ 16).int32(message.limit);
      if (
        message.fields != null &&
        Object.hasOwnProperty.call(message, "fields")
      )
        for (
          let keys = Object.keys(message.fields), i = 0;
          i < keys.length;
          ++i
        ) {
          writer
            .uint32(/* id 3, wireType 2 =*/ 26)
            .fork()
            .uint32(/* id 1, wireType 2 =*/ 10)
            .string(keys[i]);
          $root.dreas.DREASRuleField.encode(
            message.fields[keys[i]],
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
            _depth + 1,
          )
            .ldelim()
            .ldelim();
        }
      if (
        message.$unknowns != null &&
        Object.hasOwnProperty.call(message, "$unknowns")
      )
        for (let i = 0; i < message.$unknowns.length; ++i)
          writer.raw(message.$unknowns[i]);
      return writer;
    };

    /**
     * Encodes the specified DREASRuleEndpoint message, length delimited. Does not implicitly {@link dreas.DREASRuleEndpoint.verify|verify} messages.
     * @function encodeDelimited
     * @memberof dreas.DREASRuleEndpoint
     * @static
     * @param {dreas.DREASRuleEndpoint.$Properties} message DREASRuleEndpoint message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DREASRuleEndpoint.encodeDelimited = function encodeDelimited(
      message,
      writer,
    ) {
      return this.encode(
        message,
        writer && writer.len ? writer.fork() : writer,
      ).ldelim();
    };

    /**
     * Decodes a DREASRuleEndpoint message from the specified reader or buffer.
     * @function decode
     * @memberof dreas.DREASRuleEndpoint
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {dreas.DREASRuleEndpoint & dreas.DREASRuleEndpoint.$Shape} DREASRuleEndpoint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DREASRuleEndpoint.decode = function decode(
      reader,
      length,
      _end,
      _depth,
      _target,
    ) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      if (_depth === undefined) _depth = 0;
      if (_depth > $Reader.recursionLimit) throw Error("max depth exceeded");
      let end = length === undefined ? reader.len : reader.pos + length,
        message = _target || new $root.dreas.DREASRuleEndpoint(),
        key,
        value;
      while (reader.pos < end) {
        let start = reader.pos;
        let tag = reader.tag();
        if (tag === _end) {
          _end = undefined;
          break;
        }
        let wireType = tag & 7;
        switch ((tag >>>= 3)) {
          case 1: {
            if (wireType !== 2) break;
            message.container = reader.string();
            message._container = "container";
            continue;
          }
          case 2: {
            if (wireType !== 0) break;
            message.limit = reader.int32();
            message._limit = "limit";
            continue;
          }
          case 3: {
            if (wireType !== 2) break;
            if (message.fields === $util.emptyObject) message.fields = {};
            let end2 = reader.uint32() + reader.pos;
            key = "";
            value = null;
            while (reader.pos < end2) {
              let tag2 = reader.tag();
              wireType = tag2 & 7;
              switch ((tag2 >>>= 3)) {
                case 1:
                  if (wireType !== 2) break;
                  key = reader.string();
                  continue;
                case 2:
                  if (wireType !== 2) break;
                  value = $root.dreas.DREASRuleField.decode(
                    reader,
                    reader.uint32(),
                    undefined,
                    _depth + 1,
                  );
                  continue;
              }
              reader.skipType(wireType, _depth, tag2);
            }
            if (key === "__proto__") $util.makeProp(message.fields, key);
            message.fields[key] = value || new $root.dreas.DREASRuleField();
            continue;
          }
        }
        reader.skipType(wireType, _depth, tag);
        if (!reader.discardUnknown) {
          $util.makeProp(message, "$unknowns", false);
          (message.$unknowns || (message.$unknowns = [])).push(
            reader.raw(start, reader.pos),
          );
        }
      }
      if (_end !== undefined) throw Error("missing end group");
      return message;
    };

    /**
     * Decodes a DREASRuleEndpoint message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof dreas.DREASRuleEndpoint
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {dreas.DREASRuleEndpoint & dreas.DREASRuleEndpoint.$Shape} DREASRuleEndpoint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DREASRuleEndpoint.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DREASRuleEndpoint message.
     * @function verify
     * @memberof dreas.DREASRuleEndpoint
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DREASRuleEndpoint.verify = function verify(message, _depth) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) return "max depth exceeded";
      let properties = {};
      if (message.container != null && message.hasOwnProperty("container")) {
        properties._container = 1;
        if (!$util.isString(message.container))
          return "container: string expected";
      }
      if (message.limit != null && message.hasOwnProperty("limit")) {
        properties._limit = 1;
        if (!$util.isInteger(message.limit)) return "limit: integer expected";
      }
      if (message.fields != null && message.hasOwnProperty("fields")) {
        if (!$util.isObject(message.fields)) return "fields: object expected";
        let key = Object.keys(message.fields);
        for (let i = 0; i < key.length; ++i) {
          let error = $root.dreas.DREASRuleField.verify(
            message.fields[key[i]],
            _depth + 1,
          );
          if (error) return "fields." + error;
        }
      }
      return null;
    };

    /**
     * Creates a DREASRuleEndpoint message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof dreas.DREASRuleEndpoint
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {dreas.DREASRuleEndpoint} DREASRuleEndpoint
     */
    DREASRuleEndpoint.fromObject = function fromObject(object, _depth) {
      if (object instanceof $root.dreas.DREASRuleEndpoint) return object;
      if (!$util.isObject(object))
        throw TypeError(".dreas.DREASRuleEndpoint: object expected");
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) throw Error("max depth exceeded");
      let message = new $root.dreas.DREASRuleEndpoint();
      if (object.container != null)
        message.container = String(object.container);
      if (object.limit != null) message.limit = object.limit | 0;
      if (object.fields) {
        if (!$util.isObject(object.fields))
          throw TypeError(".dreas.DREASRuleEndpoint.fields: object expected");
        message.fields = {};
        for (
          let keys = Object.keys(object.fields), i = 0;
          i < keys.length;
          ++i
        ) {
          if (keys[i] === "__proto__") $util.makeProp(message.fields, keys[i]);
          if (!$util.isObject(object.fields[keys[i]]))
            throw TypeError(".dreas.DREASRuleEndpoint.fields: object expected");
          message.fields[keys[i]] = $root.dreas.DREASRuleField.fromObject(
            object.fields[keys[i]],
            _depth + 1,
          );
        }
      }
      return message;
    };

    /**
     * Creates a plain object from a DREASRuleEndpoint message. Also converts values to other types if specified.
     * @function toObject
     * @memberof dreas.DREASRuleEndpoint
     * @static
     * @param {dreas.DREASRuleEndpoint} message DREASRuleEndpoint
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DREASRuleEndpoint.toObject = function toObject(message, options, _depth) {
      if (!options) options = {};
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) throw Error("max depth exceeded");
      let object = {};
      if (options.objects || options.defaults) object.fields = {};
      if (message.container != null && message.hasOwnProperty("container"))
        object.container = message.container;
      if (message.limit != null && message.hasOwnProperty("limit"))
        object.limit = message.limit;
      let keys2;
      if (message.fields && (keys2 = Object.keys(message.fields)).length) {
        object.fields = {};
        for (let j = 0; j < keys2.length; ++j) {
          if (keys2[j] === "__proto__") $util.makeProp(object.fields, keys2[j]);
          object.fields[keys2[j]] = $root.dreas.DREASRuleField.toObject(
            message.fields[keys2[j]],
            options,
            _depth + 1,
          );
        }
      }
      return object;
    };

    /**
     * Converts this DREASRuleEndpoint to JSON.
     * @function toJSON
     * @memberof dreas.DREASRuleEndpoint
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DREASRuleEndpoint.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the type url for DREASRuleEndpoint
     * @function getTypeUrl
     * @memberof dreas.DREASRuleEndpoint
     * @static
     * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns {string} The type url
     */
    DREASRuleEndpoint.getTypeUrl = function getTypeUrl(prefix) {
      if (prefix === undefined) prefix = "type.googleapis.com";
      return prefix + "/dreas.DREASRuleEndpoint";
    };

    return DREASRuleEndpoint;
  })();

  dreas.DREASExecutionConfig = (function () {
    /**
     * Properties of a DREASExecutionConfig.
     * @typedef {Object} dreas.DREASExecutionConfig.$Properties
     * @property {string|null} [antiBotStrategy] DREASExecutionConfig antiBotStrategy
     * @property {string|null} [waitForElement] DREASExecutionConfig waitForElement
     * @property {number|null} [timeoutMs] DREASExecutionConfig timeoutMs
     * @property {boolean|null} [userAgentSpoof] DREASExecutionConfig userAgentSpoof
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */

    /**
     * Properties of a DREASExecutionConfig.
     * @memberof dreas
     * @interface IDREASExecutionConfig
     * @augments dreas.DREASExecutionConfig.$Properties
     * @deprecated Use dreas.DREASExecutionConfig.$Properties instead.
     */

    /**
     * Shape of a DREASExecutionConfig.
     * @typedef {dreas.DREASExecutionConfig.$Properties} dreas.DREASExecutionConfig.$Shape
     */

    /**
     * Constructs a new DREASExecutionConfig.
     * @memberof dreas
     * @classdesc Represents a DREASExecutionConfig.
     * @constructor
     * @param {dreas.DREASExecutionConfig.$Properties=} [properties] Properties to set
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */
    function DREASExecutionConfig(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null && keys[i] !== "__proto__")
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * DREASExecutionConfig antiBotStrategy.
     * @member {string} antiBotStrategy
     * @memberof dreas.DREASExecutionConfig
     * @instance
     */
    DREASExecutionConfig.prototype.antiBotStrategy = "";

    /**
     * DREASExecutionConfig waitForElement.
     * @member {string|null|undefined} waitForElement
     * @memberof dreas.DREASExecutionConfig
     * @instance
     */
    DREASExecutionConfig.prototype.waitForElement = null;

    /**
     * DREASExecutionConfig timeoutMs.
     * @member {number|null|undefined} timeoutMs
     * @memberof dreas.DREASExecutionConfig
     * @instance
     */
    DREASExecutionConfig.prototype.timeoutMs = null;

    /**
     * DREASExecutionConfig userAgentSpoof.
     * @member {boolean|null|undefined} userAgentSpoof
     * @memberof dreas.DREASExecutionConfig
     * @instance
     */
    DREASExecutionConfig.prototype.userAgentSpoof = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(DREASExecutionConfig.prototype, "_waitForElement", {
      get: $util.oneOfGetter(($oneOfFields = ["waitForElement"])),
      set: $util.oneOfSetter($oneOfFields),
    });

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(DREASExecutionConfig.prototype, "_timeoutMs", {
      get: $util.oneOfGetter(($oneOfFields = ["timeoutMs"])),
      set: $util.oneOfSetter($oneOfFields),
    });

    // Virtual OneOf for proto3 optional field
    Object.defineProperty(DREASExecutionConfig.prototype, "_userAgentSpoof", {
      get: $util.oneOfGetter(($oneOfFields = ["userAgentSpoof"])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * Creates a new DREASExecutionConfig instance using the specified properties.
     * @function create
     * @memberof dreas.DREASExecutionConfig
     * @static
     * @param {dreas.DREASExecutionConfig.$Properties=} [properties] Properties to set
     * @returns {dreas.DREASExecutionConfig} DREASExecutionConfig instance
     * @type {{
     *   (properties: dreas.DREASExecutionConfig.$Shape): dreas.DREASExecutionConfig & dreas.DREASExecutionConfig.$Shape;
     *   (properties?: dreas.DREASExecutionConfig.$Properties): dreas.DREASExecutionConfig;
     * }}
     */
    DREASExecutionConfig.create = function create(properties) {
      return new DREASExecutionConfig(properties);
    };

    /**
     * Encodes the specified DREASExecutionConfig message. Does not implicitly {@link dreas.DREASExecutionConfig.verify|verify} messages.
     * @function encode
     * @memberof dreas.DREASExecutionConfig
     * @static
     * @param {dreas.DREASExecutionConfig.$Properties} message DREASExecutionConfig message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DREASExecutionConfig.encode = function encode(message, writer, _depth) {
      if (!writer) writer = $Writer.create();
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) throw Error("max depth exceeded");
      if (
        message.antiBotStrategy != null &&
        Object.hasOwnProperty.call(message, "antiBotStrategy")
      )
        writer
          .uint32(/* id 1, wireType 2 =*/ 10)
          .string(message.antiBotStrategy);
      if (
        message.waitForElement != null &&
        Object.hasOwnProperty.call(message, "waitForElement")
      )
        writer
          .uint32(/* id 2, wireType 2 =*/ 18)
          .string(message.waitForElement);
      if (
        message.timeoutMs != null &&
        Object.hasOwnProperty.call(message, "timeoutMs")
      )
        writer.uint32(/* id 3, wireType 0 =*/ 24).int32(message.timeoutMs);
      if (
        message.userAgentSpoof != null &&
        Object.hasOwnProperty.call(message, "userAgentSpoof")
      )
        writer.uint32(/* id 4, wireType 0 =*/ 32).bool(message.userAgentSpoof);
      if (
        message.$unknowns != null &&
        Object.hasOwnProperty.call(message, "$unknowns")
      )
        for (let i = 0; i < message.$unknowns.length; ++i)
          writer.raw(message.$unknowns[i]);
      return writer;
    };

    /**
     * Encodes the specified DREASExecutionConfig message, length delimited. Does not implicitly {@link dreas.DREASExecutionConfig.verify|verify} messages.
     * @function encodeDelimited
     * @memberof dreas.DREASExecutionConfig
     * @static
     * @param {dreas.DREASExecutionConfig.$Properties} message DREASExecutionConfig message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DREASExecutionConfig.encodeDelimited = function encodeDelimited(
      message,
      writer,
    ) {
      return this.encode(
        message,
        writer && writer.len ? writer.fork() : writer,
      ).ldelim();
    };

    /**
     * Decodes a DREASExecutionConfig message from the specified reader or buffer.
     * @function decode
     * @memberof dreas.DREASExecutionConfig
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {dreas.DREASExecutionConfig & dreas.DREASExecutionConfig.$Shape} DREASExecutionConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DREASExecutionConfig.decode = function decode(
      reader,
      length,
      _end,
      _depth,
      _target,
    ) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      if (_depth === undefined) _depth = 0;
      if (_depth > $Reader.recursionLimit) throw Error("max depth exceeded");
      let end = length === undefined ? reader.len : reader.pos + length,
        message = _target || new $root.dreas.DREASExecutionConfig(),
        value;
      while (reader.pos < end) {
        let start = reader.pos;
        let tag = reader.tag();
        if (tag === _end) {
          _end = undefined;
          break;
        }
        let wireType = tag & 7;
        switch ((tag >>>= 3)) {
          case 1: {
            if (wireType !== 2) break;
            if ((value = reader.string()).length)
              message.antiBotStrategy = value;
            else delete message.antiBotStrategy;
            continue;
          }
          case 2: {
            if (wireType !== 2) break;
            message.waitForElement = reader.string();
            message._waitForElement = "waitForElement";
            continue;
          }
          case 3: {
            if (wireType !== 0) break;
            message.timeoutMs = reader.int32();
            message._timeoutMs = "timeoutMs";
            continue;
          }
          case 4: {
            if (wireType !== 0) break;
            message.userAgentSpoof = reader.bool();
            message._userAgentSpoof = "userAgentSpoof";
            continue;
          }
        }
        reader.skipType(wireType, _depth, tag);
        if (!reader.discardUnknown) {
          $util.makeProp(message, "$unknowns", false);
          (message.$unknowns || (message.$unknowns = [])).push(
            reader.raw(start, reader.pos),
          );
        }
      }
      if (_end !== undefined) throw Error("missing end group");
      return message;
    };

    /**
     * Decodes a DREASExecutionConfig message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof dreas.DREASExecutionConfig
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {dreas.DREASExecutionConfig & dreas.DREASExecutionConfig.$Shape} DREASExecutionConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DREASExecutionConfig.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DREASExecutionConfig message.
     * @function verify
     * @memberof dreas.DREASExecutionConfig
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DREASExecutionConfig.verify = function verify(message, _depth) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) return "max depth exceeded";
      let properties = {};
      if (
        message.antiBotStrategy != null &&
        message.hasOwnProperty("antiBotStrategy")
      )
        if (!$util.isString(message.antiBotStrategy))
          return "antiBotStrategy: string expected";
      if (
        message.waitForElement != null &&
        message.hasOwnProperty("waitForElement")
      ) {
        properties._waitForElement = 1;
        if (!$util.isString(message.waitForElement))
          return "waitForElement: string expected";
      }
      if (message.timeoutMs != null && message.hasOwnProperty("timeoutMs")) {
        properties._timeoutMs = 1;
        if (!$util.isInteger(message.timeoutMs))
          return "timeoutMs: integer expected";
      }
      if (
        message.userAgentSpoof != null &&
        message.hasOwnProperty("userAgentSpoof")
      ) {
        properties._userAgentSpoof = 1;
        if (typeof message.userAgentSpoof !== "boolean")
          return "userAgentSpoof: boolean expected";
      }
      return null;
    };

    /**
     * Creates a DREASExecutionConfig message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof dreas.DREASExecutionConfig
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {dreas.DREASExecutionConfig} DREASExecutionConfig
     */
    DREASExecutionConfig.fromObject = function fromObject(object, _depth) {
      if (object instanceof $root.dreas.DREASExecutionConfig) return object;
      if (!$util.isObject(object))
        throw TypeError(".dreas.DREASExecutionConfig: object expected");
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) throw Error("max depth exceeded");
      let message = new $root.dreas.DREASExecutionConfig();
      if (object.antiBotStrategy != null)
        if (
          typeof object.antiBotStrategy !== "string" ||
          object.antiBotStrategy.length
        )
          message.antiBotStrategy = String(object.antiBotStrategy);
      if (object.waitForElement != null)
        message.waitForElement = String(object.waitForElement);
      if (object.timeoutMs != null) message.timeoutMs = object.timeoutMs | 0;
      if (object.userAgentSpoof != null)
        message.userAgentSpoof = Boolean(object.userAgentSpoof);
      return message;
    };

    /**
     * Creates a plain object from a DREASExecutionConfig message. Also converts values to other types if specified.
     * @function toObject
     * @memberof dreas.DREASExecutionConfig
     * @static
     * @param {dreas.DREASExecutionConfig} message DREASExecutionConfig
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DREASExecutionConfig.toObject = function toObject(
      message,
      options,
      _depth,
    ) {
      if (!options) options = {};
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) throw Error("max depth exceeded");
      let object = {};
      if (options.defaults) object.antiBotStrategy = "";
      if (
        message.antiBotStrategy != null &&
        message.hasOwnProperty("antiBotStrategy")
      )
        object.antiBotStrategy = message.antiBotStrategy;
      if (
        message.waitForElement != null &&
        message.hasOwnProperty("waitForElement")
      )
        object.waitForElement = message.waitForElement;
      if (message.timeoutMs != null && message.hasOwnProperty("timeoutMs"))
        object.timeoutMs = message.timeoutMs;
      if (
        message.userAgentSpoof != null &&
        message.hasOwnProperty("userAgentSpoof")
      )
        object.userAgentSpoof = message.userAgentSpoof;
      return object;
    };

    /**
     * Converts this DREASExecutionConfig to JSON.
     * @function toJSON
     * @memberof dreas.DREASExecutionConfig
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DREASExecutionConfig.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the type url for DREASExecutionConfig
     * @function getTypeUrl
     * @memberof dreas.DREASExecutionConfig
     * @static
     * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns {string} The type url
     */
    DREASExecutionConfig.getTypeUrl = function getTypeUrl(prefix) {
      if (prefix === undefined) prefix = "type.googleapis.com";
      return prefix + "/dreas.DREASExecutionConfig";
    };

    return DREASExecutionConfig;
  })();

  dreas.DREASManifest = (function () {
    /**
     * Properties of a DREASManifest.
     * @typedef {Object} dreas.DREASManifest.$Properties
     * @property {string|null} [providerId] DREASManifest providerId
     * @property {string|null} [ruleVersion] DREASManifest ruleVersion
     * @property {string|null} [minCoreVersion] DREASManifest minCoreVersion
     * @property {dreas.DREASExecutionConfig.$Properties|null} [executionConfig] DREASManifest executionConfig
     * @property {Object.<string,dreas.DREASRuleEndpoint.$Properties>|null} [rules] DREASManifest rules
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */

    /**
     * Properties of a DREASManifest.
     * @memberof dreas
     * @interface IDREASManifest
     * @augments dreas.DREASManifest.$Properties
     * @deprecated Use dreas.DREASManifest.$Properties instead.
     */

    /**
     * Shape of a DREASManifest.
     * @typedef {dreas.DREASManifest.$Properties} dreas.DREASManifest.$Shape
     */

    /**
     * Constructs a new DREASManifest.
     * @memberof dreas
     * @classdesc Represents a DREASManifest.
     * @constructor
     * @param {dreas.DREASManifest.$Properties=} [properties] Properties to set
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding
     */
    function DREASManifest(properties) {
      this.rules = {};
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null && keys[i] !== "__proto__")
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * DREASManifest providerId.
     * @member {string} providerId
     * @memberof dreas.DREASManifest
     * @instance
     */
    DREASManifest.prototype.providerId = "";

    /**
     * DREASManifest ruleVersion.
     * @member {string} ruleVersion
     * @memberof dreas.DREASManifest
     * @instance
     */
    DREASManifest.prototype.ruleVersion = "";

    /**
     * DREASManifest minCoreVersion.
     * @member {string} minCoreVersion
     * @memberof dreas.DREASManifest
     * @instance
     */
    DREASManifest.prototype.minCoreVersion = "";

    /**
     * DREASManifest executionConfig.
     * @member {dreas.DREASExecutionConfig.$Properties|null|undefined} executionConfig
     * @memberof dreas.DREASManifest
     * @instance
     */
    DREASManifest.prototype.executionConfig = null;

    /**
     * DREASManifest rules.
     * @member {Object.<string,dreas.DREASRuleEndpoint.$Properties>} rules
     * @memberof dreas.DREASManifest
     * @instance
     */
    DREASManifest.prototype.rules = $util.emptyObject;

    /**
     * Creates a new DREASManifest instance using the specified properties.
     * @function create
     * @memberof dreas.DREASManifest
     * @static
     * @param {dreas.DREASManifest.$Properties=} [properties] Properties to set
     * @returns {dreas.DREASManifest} DREASManifest instance
     * @type {{
     *   (properties: dreas.DREASManifest.$Shape): dreas.DREASManifest & dreas.DREASManifest.$Shape;
     *   (properties?: dreas.DREASManifest.$Properties): dreas.DREASManifest;
     * }}
     */
    DREASManifest.create = function create(properties) {
      return new DREASManifest(properties);
    };

    /**
     * Encodes the specified DREASManifest message. Does not implicitly {@link dreas.DREASManifest.verify|verify} messages.
     * @function encode
     * @memberof dreas.DREASManifest
     * @static
     * @param {dreas.DREASManifest.$Properties} message DREASManifest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DREASManifest.encode = function encode(message, writer, _depth) {
      if (!writer) writer = $Writer.create();
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) throw Error("max depth exceeded");
      if (
        message.providerId != null &&
        Object.hasOwnProperty.call(message, "providerId")
      )
        writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.providerId);
      if (
        message.ruleVersion != null &&
        Object.hasOwnProperty.call(message, "ruleVersion")
      )
        writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.ruleVersion);
      if (
        message.minCoreVersion != null &&
        Object.hasOwnProperty.call(message, "minCoreVersion")
      )
        writer
          .uint32(/* id 3, wireType 2 =*/ 26)
          .string(message.minCoreVersion);
      if (
        message.executionConfig != null &&
        Object.hasOwnProperty.call(message, "executionConfig")
      )
        $root.dreas.DREASExecutionConfig.encode(
          message.executionConfig,
          writer.uint32(/* id 4, wireType 2 =*/ 34).fork(),
          _depth + 1,
        ).ldelim();
      if (message.rules != null && Object.hasOwnProperty.call(message, "rules"))
        for (
          let keys = Object.keys(message.rules), i = 0;
          i < keys.length;
          ++i
        ) {
          writer
            .uint32(/* id 5, wireType 2 =*/ 42)
            .fork()
            .uint32(/* id 1, wireType 2 =*/ 10)
            .string(keys[i]);
          $root.dreas.DREASRuleEndpoint.encode(
            message.rules[keys[i]],
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
            _depth + 1,
          )
            .ldelim()
            .ldelim();
        }
      if (
        message.$unknowns != null &&
        Object.hasOwnProperty.call(message, "$unknowns")
      )
        for (let i = 0; i < message.$unknowns.length; ++i)
          writer.raw(message.$unknowns[i]);
      return writer;
    };

    /**
     * Encodes the specified DREASManifest message, length delimited. Does not implicitly {@link dreas.DREASManifest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof dreas.DREASManifest
     * @static
     * @param {dreas.DREASManifest.$Properties} message DREASManifest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DREASManifest.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(
        message,
        writer && writer.len ? writer.fork() : writer,
      ).ldelim();
    };

    /**
     * Decodes a DREASManifest message from the specified reader or buffer.
     * @function decode
     * @memberof dreas.DREASManifest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {dreas.DREASManifest & dreas.DREASManifest.$Shape} DREASManifest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DREASManifest.decode = function decode(
      reader,
      length,
      _end,
      _depth,
      _target,
    ) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      if (_depth === undefined) _depth = 0;
      if (_depth > $Reader.recursionLimit) throw Error("max depth exceeded");
      let end = length === undefined ? reader.len : reader.pos + length,
        message = _target || new $root.dreas.DREASManifest(),
        key,
        value;
      while (reader.pos < end) {
        let start = reader.pos;
        let tag = reader.tag();
        if (tag === _end) {
          _end = undefined;
          break;
        }
        let wireType = tag & 7;
        switch ((tag >>>= 3)) {
          case 1: {
            if (wireType !== 2) break;
            if ((value = reader.string()).length) message.providerId = value;
            else delete message.providerId;
            continue;
          }
          case 2: {
            if (wireType !== 2) break;
            if ((value = reader.string()).length) message.ruleVersion = value;
            else delete message.ruleVersion;
            continue;
          }
          case 3: {
            if (wireType !== 2) break;
            if ((value = reader.string()).length)
              message.minCoreVersion = value;
            else delete message.minCoreVersion;
            continue;
          }
          case 4: {
            if (wireType !== 2) break;
            message.executionConfig = $root.dreas.DREASExecutionConfig.decode(
              reader,
              reader.uint32(),
              undefined,
              _depth + 1,
              message.executionConfig,
            );
            continue;
          }
          case 5: {
            if (wireType !== 2) break;
            if (message.rules === $util.emptyObject) message.rules = {};
            let end2 = reader.uint32() + reader.pos;
            key = "";
            value = null;
            while (reader.pos < end2) {
              let tag2 = reader.tag();
              wireType = tag2 & 7;
              switch ((tag2 >>>= 3)) {
                case 1:
                  if (wireType !== 2) break;
                  key = reader.string();
                  continue;
                case 2:
                  if (wireType !== 2) break;
                  value = $root.dreas.DREASRuleEndpoint.decode(
                    reader,
                    reader.uint32(),
                    undefined,
                    _depth + 1,
                  );
                  continue;
              }
              reader.skipType(wireType, _depth, tag2);
            }
            if (key === "__proto__") $util.makeProp(message.rules, key);
            message.rules[key] = value || new $root.dreas.DREASRuleEndpoint();
            continue;
          }
        }
        reader.skipType(wireType, _depth, tag);
        if (!reader.discardUnknown) {
          $util.makeProp(message, "$unknowns", false);
          (message.$unknowns || (message.$unknowns = [])).push(
            reader.raw(start, reader.pos),
          );
        }
      }
      if (_end !== undefined) throw Error("missing end group");
      return message;
    };

    /**
     * Decodes a DREASManifest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof dreas.DREASManifest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {dreas.DREASManifest & dreas.DREASManifest.$Shape} DREASManifest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DREASManifest.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DREASManifest message.
     * @function verify
     * @memberof dreas.DREASManifest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DREASManifest.verify = function verify(message, _depth) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) return "max depth exceeded";
      if (message.providerId != null && message.hasOwnProperty("providerId"))
        if (!$util.isString(message.providerId))
          return "providerId: string expected";
      if (message.ruleVersion != null && message.hasOwnProperty("ruleVersion"))
        if (!$util.isString(message.ruleVersion))
          return "ruleVersion: string expected";
      if (
        message.minCoreVersion != null &&
        message.hasOwnProperty("minCoreVersion")
      )
        if (!$util.isString(message.minCoreVersion))
          return "minCoreVersion: string expected";
      if (
        message.executionConfig != null &&
        message.hasOwnProperty("executionConfig")
      ) {
        let error = $root.dreas.DREASExecutionConfig.verify(
          message.executionConfig,
          _depth + 1,
        );
        if (error) return "executionConfig." + error;
      }
      if (message.rules != null && message.hasOwnProperty("rules")) {
        if (!$util.isObject(message.rules)) return "rules: object expected";
        let key = Object.keys(message.rules);
        for (let i = 0; i < key.length; ++i) {
          let error = $root.dreas.DREASRuleEndpoint.verify(
            message.rules[key[i]],
            _depth + 1,
          );
          if (error) return "rules." + error;
        }
      }
      return null;
    };

    /**
     * Creates a DREASManifest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof dreas.DREASManifest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {dreas.DREASManifest} DREASManifest
     */
    DREASManifest.fromObject = function fromObject(object, _depth) {
      if (object instanceof $root.dreas.DREASManifest) return object;
      if (!$util.isObject(object))
        throw TypeError(".dreas.DREASManifest: object expected");
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) throw Error("max depth exceeded");
      let message = new $root.dreas.DREASManifest();
      if (object.providerId != null)
        if (typeof object.providerId !== "string" || object.providerId.length)
          message.providerId = String(object.providerId);
      if (object.ruleVersion != null)
        if (typeof object.ruleVersion !== "string" || object.ruleVersion.length)
          message.ruleVersion = String(object.ruleVersion);
      if (object.minCoreVersion != null)
        if (
          typeof object.minCoreVersion !== "string" ||
          object.minCoreVersion.length
        )
          message.minCoreVersion = String(object.minCoreVersion);
      if (object.executionConfig != null) {
        if (!$util.isObject(object.executionConfig))
          throw TypeError(
            ".dreas.DREASManifest.executionConfig: object expected",
          );
        message.executionConfig = $root.dreas.DREASExecutionConfig.fromObject(
          object.executionConfig,
          _depth + 1,
        );
      }
      if (object.rules) {
        if (!$util.isObject(object.rules))
          throw TypeError(".dreas.DREASManifest.rules: object expected");
        message.rules = {};
        for (
          let keys = Object.keys(object.rules), i = 0;
          i < keys.length;
          ++i
        ) {
          if (keys[i] === "__proto__") $util.makeProp(message.rules, keys[i]);
          if (!$util.isObject(object.rules[keys[i]]))
            throw TypeError(".dreas.DREASManifest.rules: object expected");
          message.rules[keys[i]] = $root.dreas.DREASRuleEndpoint.fromObject(
            object.rules[keys[i]],
            _depth + 1,
          );
        }
      }
      return message;
    };

    /**
     * Creates a plain object from a DREASManifest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof dreas.DREASManifest
     * @static
     * @param {dreas.DREASManifest} message DREASManifest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DREASManifest.toObject = function toObject(message, options, _depth) {
      if (!options) options = {};
      if (_depth === undefined) _depth = 0;
      if (_depth > $util.recursionLimit) throw Error("max depth exceeded");
      let object = {};
      if (options.objects || options.defaults) object.rules = {};
      if (options.defaults) {
        object.providerId = "";
        object.ruleVersion = "";
        object.minCoreVersion = "";
        object.executionConfig = null;
      }
      if (message.providerId != null && message.hasOwnProperty("providerId"))
        object.providerId = message.providerId;
      if (message.ruleVersion != null && message.hasOwnProperty("ruleVersion"))
        object.ruleVersion = message.ruleVersion;
      if (
        message.minCoreVersion != null &&
        message.hasOwnProperty("minCoreVersion")
      )
        object.minCoreVersion = message.minCoreVersion;
      if (
        message.executionConfig != null &&
        message.hasOwnProperty("executionConfig")
      )
        object.executionConfig = $root.dreas.DREASExecutionConfig.toObject(
          message.executionConfig,
          options,
          _depth + 1,
        );
      let keys2;
      if (message.rules && (keys2 = Object.keys(message.rules)).length) {
        object.rules = {};
        for (let j = 0; j < keys2.length; ++j) {
          if (keys2[j] === "__proto__") $util.makeProp(object.rules, keys2[j]);
          object.rules[keys2[j]] = $root.dreas.DREASRuleEndpoint.toObject(
            message.rules[keys2[j]],
            options,
            _depth + 1,
          );
        }
      }
      return object;
    };

    /**
     * Converts this DREASManifest to JSON.
     * @function toJSON
     * @memberof dreas.DREASManifest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DREASManifest.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the type url for DREASManifest
     * @function getTypeUrl
     * @memberof dreas.DREASManifest
     * @static
     * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns {string} The type url
     */
    DREASManifest.getTypeUrl = function getTypeUrl(prefix) {
      if (prefix === undefined) prefix = "type.googleapis.com";
      return prefix + "/dreas.DREASManifest";
    };

    return DREASManifest;
  })();

  return dreas;
})());

export { $root as default };
