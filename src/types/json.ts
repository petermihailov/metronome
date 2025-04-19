type JSONValue = string | number | boolean | null | JSONArray | JSONObject

interface JSONObject {
  [key: string]: JSONValue
}

interface JSONArray extends Array<JSONValue> {}
