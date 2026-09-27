const express=require('express'),fs=require('fs'),path=require('path');
const app=express(); const PORT=process.env.PORT||3000; const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD||'1234';
const DB=path.join(__dirname,'data','orders.json');
app.use(express.json()); app.use(express.static(path.join(__dirname,'public')));
function read(){try{return JSON.parse(fs.readFileSync(DB,'utf8'))}catch{return[]}}
function write(x){fs.writeFileSync(DB,JSON.stringify(x,null,2))}
app.post('/api/orders',(req,res)=>{const b=req.body||{}; if(!b.name||!b.phone||!b.location||!b.meal)return res.status(400).json({error:'नाम, मोबाइल, भोजन और डिलीवरी लोकेशन जरूरी है'}); const orders=read(); const order={id:'ATS-'+Date.now(),createdAt:new Date().toISOString(),status:'Pending',...b}; orders.unshift(order); write(orders); res.json({ok:true,order});});
app.post('/api/admin/login',(req,res)=>res.json({ok:req.body?.password===ADMIN_PASSWORD}));
app.get('/api/orders',(req,res)=>{if(req.headers['x-admin-password']!==ADMIN_PASSWORD)return res.status(401).json({error:'Unauthorized'});res.json(read())});
app.patch('/api/orders/:id',(req,res)=>{if(req.headers['x-admin-password']!==ADMIN_PASSWORD)return res.status(401).json({error:'Unauthorized'});const orders=read();const i=orders.findIndex(o=>o.id===req.params.id);if(i<0)return res.status(404).json({error:'Order not found'});orders[i]={...orders[i],...req.body};write(orders);res.json(orders[i])});
app.listen(PORT,()=>console.log(`Amarkantak Tiffin Service running on http://localhost:${PORT}`));
