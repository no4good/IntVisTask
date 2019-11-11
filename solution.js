const objectsArr = [
  { fullName: { surname: "xxx", firstName: "yyy", middleName: "zzz" } },
  { fullName: { surname: "XXX", firstName: "YYY", middleName: "ZZZ" } }
];

const rules = {
  fullName: { surname: true, firstName: true, middleName: false }
};

const locals = {
  "fullName.surname": "Прізвище",
  "fullName.middleName": "По-батькові"
};

const resulTransform = [];
const result = [];

const single = (obj, rules) => {
  for (key in obj) {
    let value = obj[key];
    if (value instanceof Date) {
      value = `${value.getDate()}.${value.getMonth() +
        1}.${value.getFullYear()}`;
    }
    if (typeof value == "object") {
      single(value, rules[key]);
    } else {
      if (rules[key] == false) {
        delete obj[key];
        continue;
      }
      if (typeof value == "boolean") {
        if (value == true) {
          value = "Так";
        } else {
          value = "Ні";
        }
      }
      resulTransform.push({
        name: loclal(key),
        value
      });
    }
  }
  return resulTransform;
};

const loclal = key => {
  let index = path(objectsArr);
  let title = locals[index[key]];
  if (title == undefined) {
    title = key;
  }
  return title;
};

function path(objectsArr) {
  let pathsArray = {};
  const depthPath = (depth, str) => {
    Object.keys(depth).forEach(function(key) {
      if (typeof depth[key] === "object" && !(depth[key] instanceof Date)) {
        depthPath(depth[key], str ? str + "." + key : key);
      } else {
        pathsArray[key] = str ? str + "." + key : key;
      }
    });
  };

  depthPath(objectsArr[0], "");
  return pathsArray;
}

const restruc = (arrs, rules, single) => {
  for (let i = 0; i < arrs.length; i++) {
    single(arrs[i], rules);
  }
  let fieldsInOneObject = resulTransform.length / arrs.length;

  for (let i = 0; i < arrs.length; i++) {
    for (let j = 0; j < fieldsInOneObject; j++) {
      if (i === 0) {
        result.push(
          Object.assign(
            {},
            { name: `${resulTransform[j].name}` },
            { [`value${i + 1}`]: `${resulTransform[j].value}` }
          )
        );
      } else {
        Object.assign(result[j], {
          [`value${i +
            1}`]: `${resulTransform[fieldsInOneObject * i + j].value}`
        });
      }
    }
  }

  return result;
};

console.log("Conversion result", restruc(objectsArr, rules, single));
