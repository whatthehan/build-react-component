import "antd/lib/button/style/css";
import _Button from "antd/lib/button";
import "./style.css";
import { jsx as _jsx } from "react/jsx-runtime";

var Hello = function Hello(_ref) {
  var text = _ref.text;
  return /*#__PURE__*/_jsx("h1", {
    className: "hello",
    children: /*#__PURE__*/_jsx(_Button, {
      typ: "primary",
      children: text
    })
  });
};

export default Hello;