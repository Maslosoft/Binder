
class TreeNodeCache
  nodes = {}
  constructor: () ->
    # nodes = {}

  get: (id) ->
    if typeof(nodes[id]) is 'undefined'
      return false
    return nodes[id]

  set: (id, val) ->
    nodes[id] = val