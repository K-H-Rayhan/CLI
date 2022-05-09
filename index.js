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
  const rl1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl1.question("Name of package? \n", function (name) {
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
    rl1.close();
  });
};

//Unsintalling Package
const uninstallPackage = () => {
  const rl2 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl2.question("Name of package? \n", function (name) {
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
    rl2.close();
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
    console.log(`Updating ${xes.split(" ")[1].toLowerCase()}`);
    exec(
      `npm update ${xes.split(" ")[1].toLowerCase()}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          // console.log(`Error: ${xes.split(" ")[1].toLowerCase()} ${stderr} `);
          return;
        }
        updated.push(true);
        if (updated.length == x.length - 3) {
          console.log("All packages updated successfully");
          run();
        }
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
  console.log(`Updating package ${pkgName}`);
  exec(`npm update ${pkgName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout) {
      console.log(`Updated ${pkgName}`);
      run();
    }
  });
};
//Rollback Package
const rollbackPackage = (pkg) => {
  const pkgName = pkg.split(" ")[1].toLowerCase();
  console.log(`Rollback to version of ${pkgName}: `);
  exec(`npm view ${pkgName} versions  --json`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout) {
      var stdou = null;
      stdou = JSON.parse(stdout).reverse();
      inquirer
        .prompt({
          type: "rawlist",
          name: "version",
          message: "Select version you wanna rollback",
          choices: [...stdou],
          filter(val) {
            return val;
          },
        })
        .then((answer) => {
          exec(
            `npm install ${pkgName}@${answer.version}`,
            (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
              console.log(stdout);
              run();
            }
          );
        });
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
      } else if (answer.option == "Uninstall package") {
        uninstallPackage();
      } else if (answer.option == "Update all package") {
        updateAllPackage(x);
      } else {
        const selected = answer.option;
        inquirer
          .prompt({
            type: "list",
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
            } else if (answer.options == "Update") {
              updateCertainPackage(selected);
            } else if (answer.options == "Rollback to previous version") {
              rollbackPackage(selected);
            } else {
              run();
            }
          });
      }
    });
};
run();
