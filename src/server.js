const app=require("./app");
const {PORT}=require("./config");

app.listen(PORT,()=>{
    console.log(`server running at port:${PORT}`);
});