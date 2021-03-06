export let nodedata_basic = {
  main: [],
};

export let linkdata_basic = {
  main: [],
};

export let nodedata = {
  main: [
    { key: 'microservice-1', type: "microservice", isGroup: true },
    { key: 'microservice-2', type: "microservice", isGroup: true },
    { key: 'microservice-3', type: "microservice", isGroup: true },
    { key: 'func1', group: 'microservice-1', type: "method", parameters: [{ name: "amount", type: "Currency" }] },
    { key: 'func2', group: 'microservice-1', type: "method", parameters: [{ name: "amount", type: "Currency" }] },
    { key: 'func3', group: 'microservice-2', type: "method", parameters: [{ name: "amount", type: "Currency" }] },
    { key: 'func4', group: 'microservice-3', type: "method", parameters: [{ name: "amount", type: "Currency" }] },
    { key: 'db1', name: 'db1', type: "db", category: 'db'},
  ], 
  db1: [
    {
      key: "Table1",
      widths: [NaN, NaN, 60],
      fields: [
        { name: "field1", meta: "NOT NULL", datatype: "integer", type: "pk" },
        { name: "field2", meta: "NOT NULL", datatype: "text", type: "fk" },
        { name: "fieldThree", meta: "NOT NULL", datatype: "text", type: "figure" }
      ],
      loc: "0 0"
    },
    {
      key: "Table2",
      widths: [NaN, NaN, NaN],
      fields: [
        { name: "fieldA", meta: "", datatype: "integer", type: "pk" },
        { name: "fieldB", meta: "", datatype: "integer", type: "field" },
        { name: "fieldC", meta: "", datatype: "integer", type: "fk" },
        { name: "fieldD", meta: "NOT NULL", datatype: "integer", type: "field" }
      ],
      loc: "250 0"
    },
    {
      key: "Table3",
      widths: [NaN, NaN, NaN],
      fields: [
        { name: "field3", meta: "", datatype: "integer", type: "pk" },
        { name: "field4", meta: "", datatype: "integer", type: "fk" },
        { name: "field5", meta: "", datatype: "integer", type: "field" },
        { name: "field6", meta: "NOT NULL", datatype: "integer", type: "fk" }
      ],
      loc: "250 150"
    }
  ],
};

export let linkdata = {
  main: [
    { from: 'microservice-1', to: 'microservice-2', relationship: 'event' },
    { from: 'func1', to: 'func3', relationship: 'rpc' },
    { from: 'func2', to: 'func4', relationship: 'rpc' },
    { from: 'microservice-1', to: 'db1', relationship: 'db' },
  ],
  db1: [
    { from: "Table1", fromPort: "field1", to: "Table2", toPort: "fieldC", relationship: "one-to-many" },
    { from: "Table1", fromPort: "field2", to: "Table3", toPort: "field4", relationship: "many-to-many" },
    { from: "Table2", fromPort: "fieldD", to: "Table3", toPort: "field6", relationship: "one-to-many" }
  ],
};
