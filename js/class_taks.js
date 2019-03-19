/**
 * Created by Kai on 29.03.2017.
 */
function Task(name, comment,progress, parent) {
    this.name = name;
    this.comment = comment;
    this.parent = parent || null;
    this.progress = progress || 0;
    this.childs = [];
}
Task.allTasks = {};
Task.prototype.add = function (task) {
    this.childs.push(task);
    task.parent = this;
};
Task.prototype.size =function () {
    return this.childs.length;
};
Task.lastIndex = -1;
Task.prototype.toJSON = function () {
    let output = {
        name:this.name,
        comment:this.comment,
        progress:this.progress,
        childs:this.childs
    };
    return JSON.stringify(output);
};
Task.fromJSONObject = function (obj, parent) {
    let output =  new Task(obj.name, obj.comment, obj.progress, parent);
    log(obj.toString());
    log(obj.hasOwnProperty("childs"));
    log(obj.childs.toString());
    let n = obj.childs.length; // hier sagt er,
    if (n) {
        let newChilds = [];
        for (let i=0; i<n; i++) {
            let c = obj.childs[i];
            newChilds.push(Task.fromJSONObject(c.name, c.comment, c.progress, output));
        }
        output.childs = newChilds;
    }
    return output;
};
Task.load = function () {
    let storage = window.localStorage.getItem(APPNAME);
    log(storage);
    let jsonObj = JSON.parse(storage);
    Task.root = Task.fromJSONObject(jsonObj, null);
};
Task.save = function () {
   window.localStorage.setItem(APPNAME, JSON.stringify(Task.root));
};
Task.prototype.new = function (name, comment, progress, parent) {
    this.add(new Task(name, comment, progress, parent));
};
Task.root = new Task("root","oberstes");
Task.root.new("downer1", "unter1");
Task.root.new("downer2", "unter2",  12);
Task.save();
console.log ("saved");
Task.load();
console.log("loaded");
console.log(JSON.stringify(Task.root));