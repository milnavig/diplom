import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

function init() {
  const $ = go.GraphObject.make;

  let myDiagram =
    $(go.Diagram,
      {
        "undoManager.isEnabled": true,
        layout: $(go.TreeLayout,
          { // this only lays out in trees nodes connected by "generalization" links
            angle: 90,
            path: go.TreeLayout.PathSource,  // links go from child to parent
            setsPortSpot: false,  // keep Spot.AllSides for link connection spot
            setsChildPortSpot: false,  // keep Spot.AllSides
            // nodes not connected by "generalization" links are laid out horizontally
            arrangement: go.TreeLayout.ArrangementHorizontal
          })
      });

  // show visibility or access as a single character at the beginning of each property or method
  function convertVisibility(v) {
    switch (v) {
      case "public": return "+";
      case "private": return "-";
      case "protected": return "#";
      case "package": return "~";
      default: return v;
    }
  }

  // the item template for properties
  var propertyTemplate =
  $(go.Panel, "Horizontal",
    // property visibility/access
    $(go.TextBlock,
      { isMultiline: false, editable: false, width: 12 },
      new go.Binding("text", "visibility", convertVisibility)),
    // property name, underlined if scope=="class" to indicate static property
    $(go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding("text", "name").makeTwoWay(),
      new go.Binding("isUnderline", "scope", s => s[0] === 'c')),
    // property type, if known
    $(go.TextBlock, "",
      new go.Binding("text", "type", t => t ? ": " : "")),
    $(go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding("text", "type").makeTwoWay()),
    // property default value, if any
    $(go.TextBlock,
      { isMultiline: false, editable: false },
      new go.Binding("text", "default", s => s ? " = " + s : ""))
  );

  // the item template for methods
  var methodTemplate =
    $(go.Panel, "Horizontal",
      // method visibility/access
      $(go.TextBlock,
        { isMultiline: false, editable: false, width: 12 },
        new go.Binding("text", "visibility", convertVisibility)),
      // method name, underlined if scope=="class" to indicate static method
      $(go.TextBlock,
        { isMultiline: false, editable: true },
        new go.Binding("text", "name").makeTwoWay(),
        new go.Binding("isUnderline", "scope", s => s[0] === 'c')),
      // method parameters
      $(go.TextBlock, "()",
        // this does not permit adding/editing/removing of parameters via inplace edits
        new go.Binding("text", "parameters", function (parr) {
          var s = "(";
          for (var i = 0; i < parr.length; i++) {
            var param = parr[i];
            if (i > 0) s += ", ";
            s += param.name + ": " + param.type;
          }
          return s + ")";
        })),
      // method return type, if any
      $(go.TextBlock, "",
        new go.Binding("text", "type", t => t ? ": " : "")),
      $(go.TextBlock,
        { isMultiline: false, editable: true },
        new go.Binding("text", "type").makeTwoWay())
    );

  // this simple template does not have any buttons to permit adding or
  // removing properties or methods, but it could!
  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      {
        locationSpot: go.Spot.Center,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides
      },
      $(go.Shape, { fill: "lightyellow" }),
      $(go.Panel, "Table",
        { defaultRowSeparatorStroke: "black" },
        // header
        $(go.TextBlock,
          {
            row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
            font: "bold 12pt sans-serif",
            isMultiline: false, editable: true
          },
          new go.Binding("text", "name").makeTwoWay()),
        // properties
        $(go.TextBlock, "Properties",
          { row: 1, font: "italic 10pt sans-serif" },
          new go.Binding("visible", "visible", v => !v).ofObject("PROPERTIES")),
        $(go.Panel, "Vertical", { name: "PROPERTIES" },
          new go.Binding("itemArray", "properties"),
          {
            row: 1, margin: 3, stretch: go.GraphObject.Fill,
            defaultAlignment: go.Spot.Left, background: "lightyellow",
            itemTemplate: propertyTemplate
          }
        ),
        $("PanelExpanderButton", "PROPERTIES",
          { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
          new go.Binding("visible", "properties", arr => arr.length > 0)),
        // methods
        $(go.TextBlock, "Methods",
          { row: 2, font: "italic 10pt sans-serif" },
          new go.Binding("visible", "visible", v => !v).ofObject("METHODS")),
        $(go.Panel, "Vertical", { name: "METHODS" },
          new go.Binding("itemArray", "methods"),
          {
            row: 2, margin: 3, stretch: go.GraphObject.Fill,
            defaultAlignment: go.Spot.Left, background: "lightyellow",
            itemTemplate: methodTemplate
          }
        ),
        $("PanelExpanderButton", "METHODS",
          { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
          new go.Binding("visible", "methods", arr => arr.length > 0))
      )
    );

  function convertIsTreeLink(r) {
    return r === "generalization";
  }

  function convertFromArrow(r) {
    switch (r) {
      case "generalization": return "";
      default: return "";
    }
  }

  function convertToArrow(r) {
    switch (r) {
      case "generalization": return "Triangle";
      case "aggregation": return "StretchedDiamond";
      default: return "";
    }
  }

  myDiagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.Orthogonal },
      new go.Binding("isLayoutPositioned", "relationship", convertIsTreeLink),
      $(go.Shape),
      $(go.Shape, { scale: 1.3, fill: "white" },
        new go.Binding("fromArrow", "relationship", convertFromArrow)),
      $(go.Shape, { scale: 1.3, fill: "white" },
        new go.Binding("toArrow", "relationship", convertToArrow))
    );
  /*
  myDiagram.groupTemplate =
    $(go.Group, "Auto", { 
      background: "transparent",
      ungroupable: true,
      // highlight when dragging into the Group
      mouseDragEnter: function(e, grp, prev) { highlightGroup(e, grp, true); },
      mouseDragLeave: function(e, grp, next) { highlightGroup(e, grp, false); },
      computesBoundsAfterDrag: true,
      // when the selection is dropped into a Group, add the selected Parts into that Group;
      // if it fails, cancel the tool, rolling back any changes
      mouseDrop: finishDrop,
      handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
      // Groups containing Groups lay out their members horizontally
      layout: makeLayout(false),
      cursor: "move"
    },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    new go.Binding("layout", "horiz", makeLayout),
    new go.Binding("background", "isHighlighted", function(h) {
      return h ? "rgba(0,255,0,0.6)" : "transparent";
    }).ofObject(),
    $(go.Shape, "Rectangle",
      { fill: null, stroke: defaultColor(false), strokeWidth: 2 },
      new go.Binding("stroke", "horiz", defaultColor),
      new go.Binding("stroke", "color")),
    $(go.Panel, "Vertical",  // title above Placeholder
      $(go.Panel, "Horizontal",  // button next to TextBlock
        {
        name: "hover-screenshot-panel",
        stretch: go.GraphObject.Horizontal, 
        background: defaultColor(false), 
        portId: "totale",
        // allows links to/from all sides
        fromSpot: go.Spot.Right,
        toSpot: go.Spot.Left,
        fromLinkable: true,
        toLinkable: true,
        cursor:"pointer"
        },
        new go.Binding("background", "horiz", defaultColor),
        new go.Binding("background", "color"),
        $("SubGraphExpanderButton",
          { alignment: go.Spot.Right, margin: 5 }),
        $(go.TextBlock,
          {
            alignment: go.Spot.Left,
            editable: false,
            margin: 5,
            font: defaultFont(false),
            opacity: 0.75,  // allow some color to show through
            stroke: "#404040"
          },
          new go.Binding("font", "horiz", defaultFont),
          new go.Binding("text", "text").makeTwoWay())
      ),	// end Horizontal Panel
      $(go.Placeholder, { 
        padding: 15, 
        alignment: go.Spot.TopLeft 
      })
    ),  // end Vertical Panel
    $(go.Panel, "Vertical", { alignment: new go.Spot(1, 0.5) },
      new go.Binding("itemArray", "rightArray"),
      {
        //row: 3, column: 2,
        itemTemplate:
          $(go.Panel, {
              _side: "right",
              fromSpot: go.Spot.Right, toSpot: go.Spot.Right,
              fromLinkable: true, toLinkable: false, 
              cursor: "pointer",
              //contextMenu: portMenu
            },
            new go.Binding("portId", "portId"),
            $(go.Shape, "Rectangle", {
              stroke: null, strokeWidth: 0,
              //desiredSize: portSize,
              margin: new go.Margin(1, 0),
              fill: "blue"
            })
            //new go.Binding("fill", "portColor"))
          )  // end itemTemplate
      }
    )  // end Vertical Panel
  );
  */
  // setup a few example class nodes and relationships
  var nodedata = [
    {
      key: 1,
      name: "BankAccount",
      properties: [
        { name: "owner", type: "String", visibility: "public" },
        { name: "balance", type: "Currency", visibility: "public", default: "0" }
      ],
      methods: [
        { name: "deposit", parameters: [{ name: "amount", type: "Currency" }], visibility: "public" },
        { name: "withdraw", parameters: [{ name: "amount", type: "Currency" }], visibility: "public" }
      ]
    },
    {
      key: 11,
      name: "Person",
      properties: [
        { name: "name", type: "String", visibility: "public" },
        { name: "birth", type: "Date", visibility: "protected" }
      ],
      methods: [
        { name: "getCurrentAge", type: "int", visibility: "public" }
      ]
    },
    {
      key: 12,
      name: "Student",
      properties: [
        { name: "classes", type: "List<Course>", visibility: "public" }
      ],
      methods: [
        { name: "attend", parameters: [{ name: "class", type: "Course" }], visibility: "private" },
        { name: "sleep", visibility: "private" }
      ]
    },
    {
      key: 13,
      name: "Professor",
      properties: [
        { name: "classes", type: "List<Course>", visibility: "public" }
      ],
      methods: [
        { name: "teach", parameters: [{ name: "class", type: "Course" }], visibility: "private" }
      ]
    },
    {
      key: 14,
      name: "Course",
      properties: [
        { name: "name", type: "String", visibility: "public" },
        { name: "description", type: "String", visibility: "public" },
        { name: "professor", type: "Professor", visibility: "public" },
        { name: "location", type: "String", visibility: "public" },
        { name: "times", type: "List<Time>", visibility: "public" },
        { name: "prerequisites", type: "List<Course>", visibility: "public" },
        { name: "students", type: "List<Student>", visibility: "public" }
      ]
    }
  ];
  var linkdata = [
    { from: 12, to: 11, relationship: "generalization" },
    { from: 13, to: 11, relationship: "generalization" },
    { from: 14, to: 13, relationship: "aggregation" }
  ];
  myDiagram.model = new go.GraphLinksModel({
      copiesArrays: true,
      copiesArrayObjects: true,
      nodeDataArray: nodedata,
      linkDataArray: linkdata
  });

  return myDiagram;
}

export function ClassDiagram() {
  return (
    <div>
      <ReactDiagram
        initDiagram={init}
        divClassName='diagram-component'
        //onModelChange={handleModelChange}
      />
    </div>
  );
}
