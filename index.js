import chalk from "chalk";
import figlet from "figlet";
import { exec } from "child_process";
import fs from "fs";
import inquirer from "inquirer";
import readline from "readline";
import async from "async";
("use strict");
console.log(
  chalk.blue(figlet.textSync("RAY'S CLI", { horizontalLayout: "full" }))
);

//Installing Package
const installPackage = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Name of package? \n", function (name) {
    console.log(`Installing package ${name}`);
    exec(`npm install ${name}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (stdout) {
        console.log(stdout);
        run();
      }
    });
    rl.close();
  });
};

//Unsintalling Package
const uninstallPackage = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Name of package? \n", function (name) {
    console.log(`Unsintalling package ${name}`);
    exec(`npm uninstall ${name}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (stdout) {
        console.log(stdout);
        run();
      }
    });
    rl.close();
  });
};

//Uninstall Certain Package
const uninstallCertainPackage = (pkg) => {
  const pkgName = pkg.split(" ")[1].toLowerCase();
  console.log(`Uninstalling package ${pkgName}`);
  exec(`npm uninstall ${pkgName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout) {
      console.log(stdout);
      run();
    }
  });
};
//Update All Package
const updateAllPackage = (x) => {
  console.log(`Updating all package`);
  let updated = [];
  const deleteFile = function (xes, callbacks) {
    console.log(`npm update ${xes.split(" ")[1].toLowerCase()}`);
    exec(
      `npm update ${xes.split(" ")[1].toLowerCase()}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.log(`Error: ${stderr}`);
          return;
        }
        updated.push(true);
        updated.length == x.length - 3 && run();
      }
    );
  };
  async.each(x.slice(3, x.length), deleteFile).catch((err) => {
    console.log(err);
  });
};

//Update Certain Package
const updateCertainPackage = (pkg) => {
  const pkgName = pkg.split(" ")[1].toLowerCase();
  console.log(`Uninstalling package ${pkgName}`);
  console.log(`npm update ${pkgName}`);
  exec(`npm update ${pkgName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (!error) {
      console.log(`Updated ${pkgName}`);
      run();
    }
  });
};

const run = () => {
  let packageData = fs.readFileSync("package.json");
  let packages = JSON.parse(packageData).dependencies;

  const x = ["Install package", "Uninstall package", "Update all package"];
  Object.keys(packages).map((v, i) => {
    x.push(i + 1 + ") " + v.charAt(0).toUpperCase() + v.slice(1));
  });

  inquirer
    .prompt({
      type: "list",
      name: "option",
      message: "Choose:",
      choices: [...x],
      filter(val) {
        return val;
      },
    })
    .then((answer) => {
      if (answer.option == "Install package") {
        installPackage();
        exec("npm start");
      } else if (answer.option == "Uninstall package") {
        uninstallPackage();
        exec("npm start");
      } else if (answer.option == "Update all package") {
        updateAllPackage(x);
        exec("npm start");
      } else {
        const selected = answer.option;
        inquirer
          .prompt({
            type: "rawlist",
            name: "options",
            message: "What do want to do?:",
            choices: [
              "Uninstall",
              "Update",
              "Rollback to previous version",
              "Go Back",
            ],
            filter(val) {
              return val;
            },
          })
          .then((answer) => {
            if (answer.options == "Uninstall") {
              uninstallCertainPackage(selected);
              exec("npm start");
            } else if (answer.options == "Update") {
              updateCertainPackage(selected);
              exec("npm start");
            } else if (answer.options == "Rollback to previous version") {
              uninstallPackage();
              exec("npm start");
            } else {
              run();
            }
          });
      }
    });
};
run();
