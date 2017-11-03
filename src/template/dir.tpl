<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{title}}</title>
  <style>
    a {
      display: block;
    }
    span {
      display: inline-block;
      margin-left: 10px;
    }
  </style>
</head>
<body>
  {{#each files}}
    <a href="{{../dir}}/{{file}}">{{file}}<span>{{icon}}</span></a>
  {{/each}}
</body>
</html>
