import React, { useEffect, useMemo, useState } from 'react';
import { Search, Bell, Menu, X, LayoutDashboard, FolderKanban, Inbox, Wallet, Warehouse, Megaphone, Users, BarChart3, Settings, Plus, ArrowUpRight, ArrowDownRight, Phone, Eye, UserCheck, CreditCard, BellRing, Package, TrendingUp, ShieldCheck, Globe, ChevronDown, CheckCircle2, AlertTriangle, MessageCircle, Building2, Sparkles, Pencil, Trash2, Banknote, ArrowLeftRight, CalendarDays, UserRound, Briefcase, ClipboardList, ShoppingBag, Factory, Instagram, Facebook, Linkedin, Mail } from 'lucide-react';

type Lang='en'|'ar';
type Inquiry={id:string;name:string;phone:string;service:string;city:string;budget:number;status:string};
type Project={id:string;name:string;client:string;type:string;progress:number;manager:string;status:string;budget:number;deadline:string};
type Member={id:string;name:string;role:string;phone:string;email:string;password:string};
type Task={id:string;text:string;time:string;done:boolean};
type Invoice={id:string;client:string;project:string;amount:number;due:string;status:string};
type Stock={id:string;item:string;category:string;qty:number;unit:string;min:number;status:string};
type Expense={id:string;label:string;amount:number;category:string};
type Kpi={key:string;value:string;trend:string;up:boolean};
type Employee={id:string;name:string;role:string;dept:string;phone:string;salary:number;hireDate:string;status:string;attendance:string};
type PayrollRow={id:string;employeeId:string;employee:string;month:string;base:number;adjustment:number;net:number;status:string};
type Transfer={id:string;date:string;amount:number;to:string;reason:string;status:string};

const PERMS=[
  {key:'viewProjects',en:'View Projects',ar:'عرض المشاريع'},
  {key:'editProjects',en:'Edit Projects',ar:'تعديل المشاريع'},
  {key:'viewFinance',en:'View Finance',ar:'عرض المالية'},
  {key:'editFinance',en:'Edit Finance',ar:'تعديل المالية'},
  {key:'viewWarehouse',en:'View Warehouse',ar:'عرض المستودع'},
  {key:'manageInquiries',en:'Manage Inquiries',ar:'إدارة الاستفسارات'},
  {key:'viewReports',en:'View Reports',ar:'عرض التقارير'},
] as const;
type PermKey=typeof PERMS[number]['key'];
const DEFAULT_ROLES=['Project Manager','Accountant','Warehouse Manager','Marketing'];
const ROLE_AR:Record<string,string>={'Project Manager':'مدير مشروع','Accountant':'محاسب','Warehouse Manager':'مدير مستودع','Marketing':'تسويق'};

const T=(lang:Lang,en:string,ar:string)=> lang==='en'?en:ar;
const fmt=(n:number)=> 'SAR '+n.toLocaleString('en-US');
const roleLabel=(lang:Lang,role:string)=> lang==='ar' ? (ROLE_AR[role]||role) : role;

const sampleInquiries:Inquiry[]=[
  {id:'i1',name:'Abdullah Al-Harbi',phone:'+966 55 214 8890',service:'Prefab',city:'Al-Rass',budget:420000,status:'New'},
  {id:'i2',name:'Noura Al-Qassim',phone:'+966 50 771 2345',service:'GFRC',city:'Buraidah',budget:680000,status:'Quoted'},
  {id:'i3',name:'Fahad Al-Otaibi',phone:'+966 56 902 1187',service:'Container',city:'Riyadh',budget:185000,status:'Contacted'},
  {id:'i4',name:'Sara Al-Mutairi',phone:'+966 53 448 9021',service:'GFRG',city:'Al-Rass',budget:310000,status:'Won'},
  {id:'i5',name:'Khalid Al-Dossary',phone:'+966 55 903 4412',service:'Prefab',city:'Unaizah',budget:540000,status:'New'},
];
const sampleProjects:Project[]=[
  {id:'p1',name:'Luxury Villa Al-Qassim',client:'Al-Qassim Private Client',type:'Prefab Villa',progress:68,manager:'Eng. Omar',status:'On Site',budget:1240000,deadline:'2026-02-18'},
  {id:'p2',name:'Mosque Facade GFRC',client:'Al-Rass Community',type:'GFRC Facade',progress:44,manager:'Eng. Sara',status:'In Factory',budget:860000,deadline:'2026-03-02'},
  {id:'p3',name:'Container Office Riyadh',client:'Riyadh Logistics Co.',type:'Container',progress:82,manager:'Eng. Omar',status:'On Site',budget:385000,deadline:'2026-01-28'},
  {id:'p4',name:'Royal Hall GFRG',client:'Private Majlis Group',type:'GFRG Interior',progress:91,manager:'Eng. Laila',status:'On Site',budget:975000,deadline:'2026-01-20'},
  {id:'p5',name:'Majlis Al-Rass',client:'Al-Rass Family Estate',type:'Prefab Majlis',progress:27,manager:'Eng. Sara',status:'In Factory',budget:420000,deadline:'2026-04-10'},
];
const sampleMembers:Member[]=[
  {id:'m1',name:'Eng. Omar Al-Harbi',role:'Project Manager',phone:'+966 55 120 8844',email:'omar@alkader.com',password:'••••••'},
  {id:'m2',name:'Aisha Al-Qassim',role:'Accountant',phone:'+966 50 882 1190',email:'aisha@alkader.com',password:'••••••'},
  {id:'m3',name:'Yousef Al-Rass',role:'Warehouse Manager',phone:'+966 56 331 7720',email:'yousef@alkader.com',password:'••••••'},
  {id:'m4',name:'Laila Al-Mutairi',role:'Marketing',phone:'+966 53 990 2211',email:'laila@alkader.com',password:'••••••'},
];
const sampleTasks:Task[]=[
  {id:'t1',text:'Call Noura — GFRC quotation follow-up',time:'09:30',done:false},
  {id:'t2',text:'Send villa progress photos to client',time:'11:00',done:true},
  {id:'t3',text:'Confirm cement delivery for Majlis Al-Rass',time:'13:00',done:false},
  {id:'t4',text:'Review container office inspection',time:'15:30',done:false},
];
const sampleStock:Stock[]=[
  {id:'s1',item:'GFRC Moulds',category:'Moulds',qty:14,unit:'pcs',min:20,status:'Low'},
  {id:'s2',item:'Structural Steel',category:'Steel',qty:8200,unit:'kg',min:10000,status:'Low'},
  {id:'s3',item:'White Cement',category:'Cement',qty:240,unit:'bags',min:300,status:'Low'},
  {id:'s4',item:'GFRG Panels',category:'Panels',qty:96,unit:'pcs',min:80,status:'OK'},
  {id:'s5',item:'Prefab Wall Panels',category:'Panels',qty:132,unit:'pcs',min:60,status:'OK'},
];
const sampleInvoices:Invoice[]=[
  {id:'INV-2418',client:'Riyadh Logistics Co.',project:'Container Office Riyadh',amount:96250,due:'2026-01-18',status:'Pending'},
  {id:'INV-2419',client:'Private Majlis Group',project:'Royal Hall GFRG',amount:148000,due:'2026-01-22',status:'Pending'},
  {id:'INV-2420',client:'Al-Rass Community',project:'Mosque Facade GFRC',amount:141000,due:'2026-01-30',status:'Pending'},
];
const sampleEmployees:Employee[]=[
  {id:'emp1',name:'Ahmed Al-Harbi',role:'مدير الحسابات',dept:'المالية',phone:'+966 55 101 2233',salary:12000,hireDate:'2022-03-01',status:'نشط',attendance:'حاضر'},
  {id:'emp2',name:'Sara Al-Qassim',role:'محاسب',dept:'المالية',phone:'+966 50 221 3344',salary:7500,hireDate:'2023-01-15',status:'نشط',attendance:'حاضر'},
  {id:'emp3',name:'Khaled Al-Dossary',role:'مدير التسويق',dept:'التسويق',phone:'+966 55 332 4455',salary:11000,hireDate:'2022-06-10',status:'نشط',attendance:'حاضر'},
  {id:'emp4',name:'Omar Al-Rass',role:'مدير المخازن',dept:'المخازن',phone:'+966 56 443 5566',salary:9000,hireDate:'2022-02-20',status:'نشط',attendance:'حاضر'},
  {id:'emp5',name:'Youssef Al-Mutairi',role:'HR / شؤون موظفين',dept:'الموارد البشرية',phone:'+966 53 554 6677',salary:8000,hireDate:'2023-04-05',status:'نشط',attendance:'حاضر'},
  {id:'emp6',name:'Fatima Al-Otaibi',role:'موظف استقبال الطلبات',dept:'الاستقبال',phone:'+966 50 665 7788',salary:5500,hireDate:'2024-01-08',status:'نشط',attendance:'حاضر'},
  {id:'emp7',name:'Adel Al-Harbi',role:'مهندس مصنع',dept:'المصنع',phone:'+966 55 776 8899',salary:8500,hireDate:'2022-09-12',status:'نشط',attendance:'حاضر'},
  {id:'emp8',name:'Mona Al-Qassim',role:'مهندس مصنع',dept:'المصنع',phone:'+966 50 887 9900',salary:7000,hireDate:'2023-08-01',status:'نشط',attendance:'حاضر'},
  {id:'emp9',name:'Laila Al-Mutairi',role:'مدير تشغيل / مشاريع',dept:'التشغيل',phone:'+966 53 998 0011',salary:10000,hireDate:'2022-04-18',status:'نشط',attendance:'حاضر'},
  {id:'emp10',name:'Nasser Al-Dossary',role:'مدير تشغيل / مشاريع',dept:'التشغيل',phone:'+966 55 109 2211',salary:6000,hireDate:'2024-03-01',status:'نشط',attendance:'حاضر'},
  {id:'emp11',name:'Ali Al-Harbi',role:'عامل',dept:'العمال',phone:'+966 56 210 3322',salary:4500,hireDate:'2023-05-20',status:'نشط',attendance:'حاضر'},
  {id:'emp12',name:'Hassan Al-Rass',role:'عامل',dept:'العمال',phone:'+966 55 321 4433',salary:4200,hireDate:'2023-06-11',status:'نشط',attendance:'حاضر'},
  {id:'emp13',name:'Mahmoud Al-Otaibi',role:'عامل',dept:'العمال',phone:'+966 53 432 5544',salary:4800,hireDate:'2022-11-02',status:'نشط',attendance:'حاضر'},
  {id:'emp14',name:'Ibrahim Al-Qassim',role:'عامل',dept:'العمال',phone:'+966 50 543 6655',salary:4000,hireDate:'2024-02-14',status:'إجازة',attendance:'إجازة'},
  {id:'emp15',name:'Saeed Al-Dossary',role:'عامل',dept:'العمال',phone:'+966 56 654 7766',salary:5000,hireDate:'2023-03-09',status:'نشط',attendance:'حاضر'},
  {id:'emp16',name:'Tariq Al-Mutairi',role:'عامل',dept:'العمال',phone:'+966 55 765 8877',salary:4400,hireDate:'2024-05-06',status:'نشط',attendance:'حاضر'},
  {id:'emp17',name:'Faisal Al-Harbi',role:'عامل',dept:'العمال',phone:'+966 53 876 9988',salary:4600,hireDate:'2023-09-19',status:'نشط',attendance:'حاضر'},
  {id:'emp18',name:'Waleed Al-Rass',role:'عامل',dept:'العمال',phone:'+966 50 987 1099',salary:4300,hireDate:'2024-07-01',status:'نشط',attendance:'حاضر'},
  {id:'emp19',name:'Rami Al-Otaibi',role:'عامل',dept:'العمال',phone:'+966 56 098 2100',salary:4700,hireDate:'2023-12-03',status:'نشط',attendance:'حاضر'},
  {id:'emp20',name:'Samir Al-Qassim',role:'عامل',dept:'العمال',phone:'+966 55 109 3211',salary:3800,hireDate:'2024-08-15',status:'نشط',attendance:'حاضر'},
  {id:'emp21',name:'Ziad Al-Dossary',role:'عامل',dept:'العمال',phone:'+966 53 210 4322',salary:4900,hireDate:'2023-02-28',status:'نشط',attendance:'حاضر'},
  {id:'emp22',name:'Bilal Al-Mutairi',role:'عامل',dept:'العمال',phone:'+966 50 321 5433',salary:4500,hireDate:'2024-04-22',status:'نشط',attendance:'حاضر'},
  {id:'emp23',name:'Huda Al-Harbi',role:'موظف استقبال الطلبات',dept:'الاستقبال',phone:'+966 55 432 6544',salary:4800,hireDate:'2024-06-10',status:'إجازة',attendance:'إجازة'},
  {id:'emp24',name:'Amina Al-Rass',role:'محاسب',dept:'المالية',phone:'+966 53 543 7655',salary:5500,hireDate:'2024-09-01',status:'نشط',attendance:'حاضر'},
];
const PENDING_PAYROLL_IDS=['emp1','emp3','emp4','emp7','emp8','emp15'];
const samplePayroll:PayrollRow[]=sampleEmployees.map((e,i)=>({id:'pr'+(i+1),employeeId:e.id,employee:e.name,month:'يناير 2026',base:e.salary,adjustment:0,net:e.salary,status:PENDING_PAYROLL_IDS.includes(e.id)?'معلق':'تم الصرف'}));
const sampleTransfers:Transfer[]=[
  {id:'tr1',date:'2026-01-10',amount:50000,to:'Ahmed Al-Harbi',reason:'رواتب',status:'تم'},
  {id:'tr2',date:'2026-01-05',amount:30000,to:'Ahmed Al-Harbi',reason:'شراء خامات',status:'تم'},
  {id:'tr3',date:'2026-01-02',amount:12000,to:'Ahmed Al-Harbi',reason:'مصاريف مصنع',status:'تم'},
];
const defaultKpis:Kpi[]=[
  {key:'revenue',value:'SAR 1,240,000',trend:'+12.4%',up:true},
  {key:'projects',value:'18',trend:'+3',up:true},
  {key:'inquiries',value:'32',trend:'+8',up:true},
  {key:'pending',value:'SAR 385,000',trend:'-6.1%',up:false},
  {key:'warehouse',value:'SAR 742,000',trend:'+4.2%',up:true},
  {key:'leads',value:'132',trend:'+18',up:true},
];
const kpiMeta:(lang:Lang)=>Record<string,{label:string;note:string;icon:any}>=(lang)=>({
  revenue:{label:T(lang,'Total Revenue · This Month','إجمالي الإيرادات · هذا الشهر'),note:T(lang,'vs. last month','مقارنة بالشهر الماضي'),icon:TrendingUp},
  projects:{label:T(lang,'Active Projects','المشاريع النشطة'),note:T(lang,'2 near delivery','2 قريبة من التسليم'),icon:FolderKanban},
  inquiries:{label:T(lang,'New Inquiries','استفسارات جديدة'),note:T(lang,'this week','هذا الأسبوع'),icon:Inbox},
  pending:{label:T(lang,'Pending Payments','المدفوعات المعلقة'),note:T(lang,'3 invoices','3 فواتير'),icon:Wallet},
  warehouse:{label:T(lang,'Warehouse Value','قيمة المستودع'),note:T(lang,'5 categories','5 فئات'),icon:Warehouse},
  leads:{label:T(lang,'Marketing Leads','عملاء التسويق المحتملون'),note:T(lang,'from campaigns','من الحملات'),icon:Megaphone},
});

async function callApi(action:string,args:any){
  const res=await fetch("actions",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action,args})});
  const json=await res.json().catch(()=>({}));
  if(!res.ok||json.error) throw new Error(json.error||`Request failed (${res.status})`);
  return json.data;
}

type ModalKind=''|'inquiry'|'project'|'expense'|'stock'|'member'|'broadcast'|'invoice'|'task'|'kpi'|'role'|'employee'|'payroll'|'transfer';
type DeleteTarget={kind:string;localId:string;label:string;collection?:string}|null;

const DEPT_DASHBOARDS=[
  {id:'accounts-manager',title:'لوحة مدير الحسابات',icon:Wallet,items:['خزينة','فواتير','رواتب','تقارير مالية'],desc:'يتابع الخزينة والتحويلات من المالك، ويصرف الرواتب والمصاريف المعتمدة.'},
  {id:'accountant',title:'لوحة المحاسب',icon:ClipboardList,items:['قيود','فواتير','مصاريف'],desc:'يسجّل القيود والفواتير والمصاريف، ويجهّز التقارير لمدير الحسابات.'},
  {id:'operations',title:'لوحة مدير التشغيل',icon:Factory,items:['مشاريع','عمال','جداول'],desc:'يتابع المشاريع من المصنع إلى الموقع، وتوزيع العمال والجداول اليومية.'},
  {id:'warehouse-manager',title:'لوحة مدير المخازن',icon:Warehouse,items:['مخزون','طلبات شراء','صرف خامات'],desc:'يدير المخزون وطلبات الشراء وصرف الخامات للمشاريع.'},
  {id:'marketing-manager',title:'لوحة مدير التسويق',icon:Megaphone,items:['حملات','ليدز','متابعة'],desc:'يدير الحملات والليدز والمتابعة، ويحوّل الاستفسارات الجاهزة للمبيعات.'},
  {id:'reception',title:'لوحة موظف استقبال الطلبات',icon:Inbox,items:['استقبال الاستفسارات','تحويل للأقسام'],desc:'يستقبل الطلبات والاستفسارات أولاً، ويحوّلها للقسم الصحيح.'},
];

export default function App(){
  const [lang,setLang]=useState<Lang>('ar');
  const [dir,setDir]=useState<'ltr'|'rtl'>('rtl');
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [active,setActive]=useState('dashboard');
  const [branch,setBranch]=useState('Al-Rass — Head Office');
  const [search,setSearch]=useState('');
  const [inqFilter,setInqFilter]=useState('All');
  const [projFilter,setProjFilter]=useState('All');
  const [inqSearch,setInqSearch]=useState('');
  const [projSearch,setProjSearch]=useState('');
  const [invSearch,setInvSearch]=useState('');
  const [invFilter,setInvFilter]=useState('All');
  const [stockSearch,setStockSearch]=useState('');
  const [stockFilter,setStockFilter]=useState('All');
  const [teamSearch,setTeamSearch]=useState('');
  const [taskSearch,setTaskSearch]=useState('');
  const [expenseSearch,setExpenseSearch]=useState('');
  const [empSearch,setEmpSearch]=useState('');
  const [empFilter,setEmpFilter]=useState('All');
  const [payrollSearch,setPayrollSearch]=useState('');
  const [payrollFilter,setPayrollFilter]=useState('All');
  const [selectedDept,setSelectedDept]=useState<string|null>(null);
  const [showNotif,setShowNotif]=useState(false);
  const [toast,setToast]=useState('');
  const [conn,setConn]=useState<'checking'|'connected'|'unavailable'>('checking');

  const [inquiries,setInquiries]=useState<Inquiry[]>(sampleInquiries);
  const [projects,setProjects]=useState<Project[]>(sampleProjects);
  const [members,setMembers]=useState<Member[]>(sampleMembers);
  const [tasks,setTasks]=useState<Task[]>(sampleTasks);
  const [stock,setStock]=useState<Stock[]>(sampleStock);
  const [invoices,setInvoices]=useState<Invoice[]>(sampleInvoices);
  const [roles,setRoles]=useState<string[]>(DEFAULT_ROLES);
  const [kpis,setKpis]=useState<Kpi[]>(defaultKpis);
  const [employees,setEmployees]=useState<Employee[]>(sampleEmployees);
  const [payroll,setPayroll]=useState<PayrollRow[]>(samplePayroll);
  const [transfers,setTransfers]=useState<Transfer[]>(sampleTransfers);
  const [ownerBalance,setOwnerBalance]=useState(850000);
  const [accountsBalance,setAccountsBalance]=useState(240000);
  const [expenses,setExpenses]=useState<Expense[]>([
    {id:'e1',label:'Steel procurement — Villa Al-Qassim',amount:184000,category:'Materials'},
    {id:'e2',label:'Factory labour — November',amount:92000,category:'Labour'},
    {id:'e3',label:'Transport — Riyadh delivery',amount:18400,category:'Logistics'},
  ]);
  const [perms,setPerms]=useState<Record<string,Record<PermKey,boolean>>>({
    'Project Manager':{viewProjects:true,editProjects:true,viewFinance:false,editFinance:false,viewWarehouse:true,manageInquiries:false,viewReports:true},
    'Accountant':{viewProjects:true,editProjects:false,viewFinance:true,editFinance:true,viewWarehouse:false,manageInquiries:false,viewReports:true},
    'Warehouse Manager':{viewProjects:false,editProjects:false,viewFinance:false,editFinance:false,viewWarehouse:true,manageInquiries:false,viewReports:false},
    'Marketing':{viewProjects:true,editProjects:false,viewFinance:false,editFinance:false,viewWarehouse:false,manageInquiries:true,viewReports:true},
  });
  const [permIds,setPermIds]=useState<Record<string,string>>({});
  const [recordIds,setRecordIds]=useState<Record<string,Record<string,string>>>({});

  const [modal,setModal]=useState<ModalKind>('');
  const [form,setForm]=useState<any>({});
  const [editingId,setEditingId]=useState<string|null>(null);
  const [editingKpi,setEditingKpi]=useState<string|null>(null);
  const [editingRole,setEditingRole]=useState<string|null>(null);
  const [selectedInquiry,setSelectedInquiry]=useState<Inquiry|null>(null);
  const [deleteTarget,setDeleteTarget]=useState<DeleteTarget>(null);
  const [busy,setBusy]=useState(false);

  useEffect(()=>{ setDir(lang==='ar'?'rtl':'ltr'); document.documentElement.dir=lang==='ar'?'rtl':'ltr'; document.documentElement.lang=lang==='ar'?'ar':'en'; },[lang]);
  useEffect(()=>{ if(toast){ const t=setTimeout(()=>setToast(''),3600); return ()=>clearTimeout(t);} },[toast]);

  async function reloadRecords(){
    const cols=['inquiries','projects','team_members','role_permissions','followup_tasks','inventory','expenses','invoices','app_config','employees','payroll_records','transfers'];
    const results=await Promise.all(cols.map(c=>callApi('records.list',{collection:c}).catch(()=>null)));
    const byCol:Record<string,any[]>={}; cols.forEach((c,i)=>{ byCol[c]=results[i]?.records||[]; });
    const ids:Record<string,Record<string,string>>={};
    const mapList=(c:string, key:string)=>{ const arr=(byCol[c]||[]).map((r:any)=>{ (ids[c]=ids[c]||{})[String(r.value[key]||r.value.id||r.id)]=r.id; return {...r.value,id:r.value.id||r.id}; }); return arr; };
    if(byCol.inquiries.length) setInquiries(mapList('inquiries','id'));
    if(byCol.projects.length) setProjects(mapList('projects','id'));
    if(byCol.team_members.length) setMembers(mapList('team_members','id'));
    if(byCol.followup_tasks.length) setTasks(mapList('followup_tasks','id'));
    if(byCol.inventory.length) setStock(mapList('inventory','id'));
    if(byCol.expenses.length) setExpenses(mapList('expenses','id'));
    if(byCol.invoices.length) setInvoices(mapList('invoices','id'));
    if(byCol.employees.length) setEmployees(mapList('employees','id'));
    if(byCol.payroll_records.length) setPayroll(mapList('payroll_records','id'));
    if(byCol.transfers.length) setTransfers(mapList('transfers','id'));
    if(byCol.role_permissions.length){
      const np:Record<string,Record<PermKey,boolean>>={}; const pids:Record<string,string>={};
      byCol.role_permissions.forEach((r:any)=>{ np[r.value.role]=r.value.perms; pids[r.value.role]=r.id; });
      setPerms(prev=>({...prev,...np})); setPermIds(pids);
    }
    if(byCol.app_config.length){
      byCol.app_config.forEach((r:any)=>{
        (ids['app_config']=ids['app_config']||{})[String(r.value.id)]=r.id;
        if(r.value.id==='roles' && Array.isArray(r.value.roles) && r.value.roles.length) setRoles(r.value.roles);
        if(r.value.id==='kpis' && Array.isArray(r.value.kpis) && r.value.kpis.length) setKpis(r.value.kpis);
        if(r.value.id==='balances' && typeof r.value.ownerBalance==='number'){ setOwnerBalance(r.value.ownerBalance); setAccountsBalance(r.value.accountsBalance||240000); }
      });
    }
    setRecordIds(ids);
    setConn('connected');
  }
  useEffect(()=>{ reloadRecords().catch(()=>setConn('unavailable')); },[]);

  async function persistCreate(collection:string,value:any){
    const key=`key-${collection}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    try{
      const rec=await callApi('records.create',{collection,value,idempotency_key:key});
      setConn('connected');
      setRecordIds(prev=>({...prev,[collection]:{...(prev[collection]||{}),[String(value.id)]:rec.id}}));
      return true;
    }catch(e){ setConn('unavailable'); return false; }
  }
  async function persistReplace(collection:string,localId:string,value:any){
    const rid=recordIds[collection]?.[localId];
    try{
      if(rid) await callApi('records.replace',{collection,id:rid,value});
      else await persistCreate(collection,value);
      setConn('connected'); return true;
    }catch(e){ setConn('unavailable'); return false; }
  }
  async function persistConfig(id:string,value:any){
    const rid=recordIds['app_config']?.[id];
    try{
      if(rid) await callApi('records.replace',{collection:'app_config',id:rid,value});
      else { const rec=await callApi('records.create',{collection:'app_config',value,idempotency_key:`config-${id}-${Date.now()}`}); setRecordIds(prev=>({...prev,app_config:{...(prev.app_config||{}),[id]:rec.id}})); }
      setConn('connected'); return true;
    }catch(e){ setConn('unavailable'); return false; }
  }
  async function persistDelete(collection:string,localId:string){
    const rid=recordIds[collection]?.[localId];
    if(!rid) return true;
    try{ await callApi('records.delete',{collection,id:rid}); setConn('connected'); return true; }catch(e){ setConn('unavailable'); return false; }
  }

  const filteredInq=useMemo(()=>inquiries.filter(x=>{
    const q=(search.trim()||inqSearch.trim()).toLowerCase();
    const okQ=!q||[x.name,x.phone,x.service,x.city,x.status].join(' ').toLowerCase().includes(q);
    const okF=inqFilter==='All'||x.status===inqFilter;
    return okQ&&okF;
  }),[inquiries,search,inqSearch,inqFilter]);
  const filteredProj=useMemo(()=>projects.filter(x=>{
    const q=(search.trim()||projSearch.trim()).toLowerCase();
    const okQ=!q||[x.name,x.client,x.type,x.manager,x.status].join(' ').toLowerCase().includes(q);
    const okF=projFilter==='All'||x.status===projFilter;
    return okQ&&okF;
  }),[projects,search,projSearch,projFilter]);
  const filteredInv=useMemo(()=>invoices.filter(x=>{
    const q=invSearch.trim().toLowerCase();
    const okQ=!q||[x.id,x.client,x.project,x.status].join(' ').toLowerCase().includes(q);
    const okF=invFilter==='All'||x.status===invFilter;
    return okQ&&okF;
  }),[invoices,invSearch,invFilter]);
  const filteredStock=useMemo(()=>stock.filter(x=>{
    const q=stockSearch.trim().toLowerCase();
    const okQ=!q||[x.item,x.category,x.status].join(' ').toLowerCase().includes(q);
    const okF=stockFilter==='All'||x.status===stockFilter||x.category===stockFilter;
    return okQ&&okF;
  }),[stock,stockSearch,stockFilter]);
  const filteredMembers=useMemo(()=>members.filter(x=>{
    const q=teamSearch.trim().toLowerCase();
    return !q||[x.name,x.role,x.phone,x.email].join(' ').toLowerCase().includes(q);
  }),[members,teamSearch]);
  const filteredTasks=useMemo(()=>tasks.filter(x=>{
    const q=taskSearch.trim().toLowerCase();
    return !q||x.text.toLowerCase().includes(q);
  }),[tasks,taskSearch]);
  const filteredExpenses=useMemo(()=>expenses.filter(x=>{
    const q=expenseSearch.trim().toLowerCase();
    return !q||[x.label,x.category].join(' ').toLowerCase().includes(q);
  }),[expenses,expenseSearch]);
  const filteredEmployees=useMemo(()=>employees.filter(x=>{
    const q=empSearch.trim().toLowerCase();
    const okQ=!q||[x.name,x.role,x.dept,x.phone,x.status].join(' ').toLowerCase().includes(q);
    const okF=empFilter==='All'||x.status===empFilter||x.dept===empFilter||x.role===empFilter;
    return okQ&&okF;
  }),[employees,empSearch,empFilter]);
  const filteredPayroll=useMemo(()=>payroll.filter(x=>{
    const q=payrollSearch.trim().toLowerCase();
    const okQ=!q||[x.employee,x.month,x.status].join(' ').toLowerCase().includes(q);
    const okF=payrollFilter==='All'||x.status===payrollFilter;
    return okQ&&okF;
  }),[payroll,payrollSearch,payrollFilter]);

  const revenueMonths=[620,780,910,840,1020,1150,980,1240,1100,1240,1180];
  const monthNames= lang==='ar'?['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر']:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov'];
  const totalIncome=1240000; const totalExpenses=expenses.reduce((s,x)=>s+x.amount,0);
  const profit=totalIncome-totalExpenses;

  // Employees & payroll derived totals
  const totalEmployees=employees.length;
  const totalSalaries=employees.reduce((s,x)=>s+x.salary,0);
  const paidSalaries=payroll.filter(p=>p.status==='تم الصرف').reduce((s,p)=>s+p.net,0);
  const remainingSalaries=Math.max(0,totalSalaries-paidSalaries);
  const onSiteToday=employees.filter(x=>x.attendance==='حاضر'&&(x.role.includes('عامل')||x.role.includes('مهندس')||x.role.includes('تشغيل'))).length;
  const onLeaveToday=employees.filter(x=>x.attendance==='إجازة').length;

  const nav=[
    {id:'dashboard',en:'Dashboard',ar:'لوحة التحكم',icon:LayoutDashboard},
    {id:'employees',en:'Employees & Payroll',ar:'الموظفين والرواتب',icon:Users},
    {id:'projects',en:'Projects',ar:'المشاريع',icon:FolderKanban},
    {id:'inquiries',en:'Inquiries',ar:'الاستفسارات',icon:Inbox},
    {id:'finance',en:'Accounts / Finance',ar:'الحسابات / المالية',icon:Wallet},
    {id:'warehouse',en:'Warehouse / Inventory',ar:'المستودع / المخزون',icon:Warehouse},
    {id:'marketing',en:'Marketing / Follow-up',ar:'التسويق / المتابعة',icon:Megaphone},
    {id:'team',en:'Team & Permissions',ar:'الفريق والصلاحيات',icon:Users},
    {id:'departments',en:'Department Dashboards',ar:'لوحات الأقسام الأخرى',icon:Building2},
    {id:'reports',en:'Reports',ar:'التقارير',icon:BarChart3},
    {id:'settings',en:'Settings',ar:'الإعدادات',icon:Settings},
  ];

  function showSection(id:string){ return active==='dashboard'||active===id; }

  function openAdd(kind:ModalKind){ setEditingId(null); setEditingKpi(null); setEditingRole(null); setForm({}); setModal(kind); }
  function openEdit(kind:ModalKind,item:any){
    setEditingId(item.id); setForm({...item}); setModal(kind);
  }
  function openKpiEdit(k:Kpi){ setEditingKpi(k.key); setForm({value:k.value,trend:k.trend,up:k.up}); setModal('kpi'); }
  function openRoleEdit(role:string){ setEditingRole(role); setForm({name:role}); setModal('role'); }
  function openTransferFor(emp:Employee){ setEditingId(null); setForm({to:emp.name,amount:'',reason:'رواتب',date:new Date().toISOString().slice(0,10)}); setModal('transfer'); }

  function requestDelete(kind:string,localId:string,label:string,collection?:string){ setDeleteTarget({kind,localId,label,collection}); }

  async function confirmDelete(){
    if(!deleteTarget) return;
    const t=deleteTarget; setDeleteTarget(null); setBusy(true);
    try{
      if(t.kind==='role'){
        const nextRoles=roles.filter(r=>r!==t.localId);
        setRoles(nextRoles);
        setPerms(prev=>{ const n={...prev}; delete n[t.localId]; return n; });
        const okConfig=await persistConfig('roles',{id:'roles',roles:nextRoles});
        const permRid=permIds[t.localId];
        if(permRid){ try{ await callApi('records.delete',{collection:'role_permissions',id:permRid}); }catch{} setPermIds(prev=>{ const n={...prev}; delete n[t.localId]; return n; }); }
        setToast(okConfig?T(lang,'Role deleted and saved.','تم حذف الدور وحفظه.'):T(lang,'Role removed on screen — not saved yet.','تم حذف الدور على الشاشة ولم يُحفظ بعد.'));
      } else if(t.kind==='kpi'){
        setKpis(prev=>prev.filter(k=>k.key!==t.localId));
        setToast(T(lang,'KPI removed.','تمت إزالة المؤشر.'));
      } else {
        const coll=t.collection||'';
        const ok=await persistDelete(coll,t.localId);
        if(t.kind==='inquiry') setInquiries(p=>p.filter(x=>x.id!==t.localId));
        if(t.kind==='project') setProjects(p=>p.filter(x=>x.id!==t.localId));
        if(t.kind==='invoice') setInvoices(p=>p.filter(x=>x.id!==t.localId));
        if(t.kind==='stock') setStock(p=>p.filter(x=>x.id!==t.localId));
        if(t.kind==='member') setMembers(p=>p.filter(x=>x.id!==t.localId));
        if(t.kind==='task') setTasks(p=>p.filter(x=>x.id!==t.localId));
        if(t.kind==='expense') setExpenses(p=>p.filter(x=>x.id!==t.localId));
        if(t.kind==='employee') setEmployees(p=>p.filter(x=>x.id!==t.localId));
        if(t.kind==='payroll') setPayroll(p=>p.filter(x=>x.id!==t.localId));
        if(t.kind==='transfer') setTransfers(p=>p.filter(x=>x.id!==t.localId));
        setToast(ok?T(lang,'Deleted and saved.','تم الحذف والحفظ.'):T(lang,'Removed on screen — not saved yet.','تمت الإزالة على الشاشة ولم تُحفظ بعد.'));
      }
    } finally{ setBusy(false); }
  }

  async function paySalaryForEmployee(emp:Employee){
    if(busy) return; setBusy(true);
    const existing=payroll.find(p=>p.employeeId===emp.id&&p.month==='يناير 2026');
    try{
      if(existing){
        if(existing.status==='تم الصرف'){ setToast(T(lang,'Salary already paid.','تم صرف الراتب بالفعل.')); return; }
        const next={...existing,status:'تم الصرف'};
        setPayroll(p=>p.map(x=>x.id===existing.id?next:x));
        const ok=await persistReplace('payroll_records',existing.id,next);
        setToast(ok?T(lang,`Salary paid for ${emp.name}.` ,`تم صرف راتب ${emp.name}.`):T(lang,'Salary marked paid on screen — not saved yet.','تم تحديد الراتب كمدفوع على الشاشة ولم يُحفظ بعد.'));
      } else {
        const row:PayrollRow={id:'pr'+Date.now(),employeeId:emp.id,employee:emp.name,month:'يناير 2026',base:emp.salary,adjustment:0,net:emp.salary,status:'تم الصرف'};
        setPayroll(p=>[row,...p]);
        const ok=await persistCreate('payroll_records',row);
        setToast(ok?T(lang,`Salary paid for ${emp.name}.` ,`تم صرف راتب ${emp.name}.`):T(lang,'Salary marked paid on screen — not saved yet.','تم تحديد الراتب كمدفوع على الشاشة ولم يُحفظ بعد.'));
      }
    } finally{ setBusy(false); }
  }
  async function payAllSalaries(){
    if(busy) return; setBusy(true);
    const pending=payroll.filter(p=>p.status!=='تم الصرف');
    if(!pending.length){ setToast(T(lang,'All salaries are already paid.','كل الرواتب مصروفة بالفعل.')); setBusy(false); return; }
    try{
      for(const row of pending){
        const next={...row,status:'تم الصرف'};
        setPayroll(p=>p.map(x=>x.id===row.id?next:x));
        await persistReplace('payroll_records',row.id,next);
      }
      setToast(T(lang,`All salaries paid — ${pending.length} employees.` ,`تم صرف كل الرواتب — ${pending.length} موظف.`));
    } finally{ setBusy(false); }
  }
  async function payPayrollRow(row:PayrollRow){
    if(busy) return; setBusy(true);
    const next={...row,status:'تم الصرف'};
    setPayroll(p=>p.map(x=>x.id===row.id?next:x));
    const ok=await persistReplace('payroll_records',row.id,next);
    setToast(ok?T(lang,`Salary paid for ${row.employee}.` ,`تم صرف راتب ${row.employee}.`):T(lang,'Salary marked paid on screen — not saved yet.','تم تحديد الراتب كمدفوع على الشاشة ولم يُحفظ بعد.'));
    setBusy(false);
  }

  async function submitModal(){
    if(busy) return; setBusy(true);
    const isEdit=!!editingId;
    const id=editingId||('x'+Date.now());
    try{
      if(modal==='kpi' && editingKpi){
        const next=kpis.map(k=>k.key===editingKpi?{...k,value:String(form.value||k.value),trend:String(form.trend||k.trend),up:form.up!==undefined?!!form.up:k.up}:k);
        setKpis(next);
        const ok=await persistConfig('kpis',{id:'kpis',kpis:next});
        setToast(ok?T(lang,'KPI saved.','تم حفظ المؤشر.'):T(lang,'KPI shown locally — not saved yet.','تم عرض المؤشر محلياً ولم يُحفظ بعد.'));
      }
      if(modal==='role'){
        if(editingRole){
          const newName=(form.name||editingRole).trim();
          const nextRoles=roles.map(r=>r===editingRole?newName:r);
          setRoles(nextRoles);
          setPerms(prev=>{ const n={...prev}; if(n[editingRole]){ n[newName]=n[editingRole]; delete n[editingRole]; } return n; });
          setMembers(prev=>prev.map(m=>m.role===editingRole?{...m,role:newName}:m));
          setPermIds(prev=>{ const n={...prev}; if(n[editingRole]){ n[newName]=n[editingRole]; delete n[editingRole]; } return n; });
          const okConfig=await persistConfig('roles',{id:'roles',roles:nextRoles});
          const permRid=permIds[editingRole];
          if(permRid && perms[editingRole]){ try{ await callApi('records.replace',{collection:'role_permissions',id:permRid,value:{role:newName,perms:perms[editingRole]}}); }catch{} }
          setToast(okConfig?T(lang,'Role saved.','تم حفظ الدور.'):T(lang,'Role shown locally — not saved yet.','تم عرض الدور محلياً ولم يُحفظ بعد.'));
        } else {
          const newName=(form.name||'New Role').trim();
          if(!roles.includes(newName)){
            const nextRoles=[...roles,newName]; setRoles(nextRoles);
            const blank:Record<PermKey,boolean>={viewProjects:false,editProjects:false,viewFinance:false,editFinance:false,viewWarehouse:false,manageInquiries:false,viewReports:false};
            setPerms(prev=>({...prev,[newName]:blank}));
            await persistConfig('roles',{id:'roles',roles:nextRoles});
            setToast(T(lang,'Role added and saved.','تمت إضافة الدور وحفظه.'));
          }
        }
      }
      if(modal==='employee'){
        const row:Employee={id,name:form.name||'موظف جديد',role:form.role||'عامل',dept:form.dept||'العمال',phone:form.phone||'',salary:Number(form.salary||4000),hireDate:form.hireDate||'2026-01-01',status:form.status||'نشط',attendance:form.attendance||'حاضر'};
        if(isEdit){ setEmployees(p=>p.map(x=>x.id===id?row:x)); const ok=await persistReplace('employees',id,row); setToast(ok?T(lang,'Employee updated.','تم تحديث الموظف.'):T(lang,'Employee updated locally — not saved yet.','تم تحديث الموظف محلياً ولم يُحفظ بعد.')); }
        else { setEmployees(p=>[row,...p]); const ok=await persistCreate('employees',row); setToast(ok?T(lang,'Employee saved.','تم حفظ الموظف.'):T(lang,'Employee shown locally — not saved yet.','تم عرض الموظف محلياً ولم يتم الحفظ بعد.')); }
      }
      if(modal==='payroll'){
        const emp=employees.find(e=>e.id===form.employeeId)||employees[0];
        const base=Number(form.base||emp?.salary||0); const adj=Number(form.adjustment||0);
        const row:PayrollRow={id,employeeId:form.employeeId||emp?.id||'',employee:form.employee||emp?.name||'',month:form.month||'يناير 2026',base,adjustment:adj,net:base+adj,status:form.status||'معلق'};
        if(isEdit){ setPayroll(p=>p.map(x=>x.id===id?row:x)); const ok=await persistReplace('payroll_records',id,row); setToast(ok?T(lang,'Payroll updated.','تم تحديث الراتب.'):T(lang,'Payroll updated locally — not saved yet.','تم تحديث الراتب محلياً ولم يُحفظ بعد.')); }
        else { setPayroll(p=>[row,...p]); const ok=await persistCreate('payroll_records',row); setToast(ok?T(lang,'Payroll saved.','تم حفظ الراتب.'):T(lang,'Payroll shown locally — not saved yet.','تم عرض الراتب محلياً ولم يتم الحفظ بعد.')); }
      }
      if(modal==='transfer'){
        const amount=Number(form.amount||0);
        if(!amount||amount<=0){ setToast(T(lang,'Enter a valid amount.','أدخل مبلغاً صحيحاً.')); return; }
        if(amount>ownerBalance){ setToast(T(lang,'Amount exceeds owner balance.','المبلغ أكبر من رصيد المالك.')); return; }
        const row:Transfer={id,date:form.date||new Date().toISOString().slice(0,10),amount,to:form.to||'Ahmed Al-Harbi',reason:form.reason||'رواتب',status:'تم'};
        const nextOwner=ownerBalance-amount; const nextAccounts=accountsBalance+amount;
        setTransfers(p=>[row,...p]);
        setOwnerBalance(nextOwner); setAccountsBalance(nextAccounts);
        const okT=await persistCreate('transfers',row);
        const okB=await persistConfig('balances',{id:'balances',ownerBalance:nextOwner,accountsBalance:nextAccounts});
        setToast((okT&&okB)?T(lang,`Transferred ${fmt(amount)} to the accounts manager.` ,`تم تحويل ${fmt(amount)} لمدير الحسابات.`):T(lang,'Transfer shown on screen — not saved yet.','تم عرض التحويل على الشاشة ولم يُحفظ بعد.'));
      }
      if(modal==='inquiry'){
        const row:Inquiry={id,name:form.name||'New Client',phone:form.phone||'',service:form.service||'Prefab',city:form.city||'Al-Rass',budget:Number(form.budget||100000),status:form.status||'New'};
        if(isEdit){ setInquiries(p=>p.map(x=>x.id===id?row:x)); const ok=await persistReplace('inquiries',id,row); setToast(ok?T(lang,'Inquiry updated.','تم تحديث الاستفسار.'):T(lang,'Inquiry updated locally — not saved yet.','تم تحديث الاستفسار محلياً ولم يُحفظ بعد.')); }
        else { setInquiries(p=>[row,...p]); const ok=await persistCreate('inquiries',row); setToast(ok?T(lang,'Inquiry saved.','تم حفظ الاستفسار.') : T(lang,'Inquiry shown locally — connection unavailable, not saved yet.','تم عرض الاستفسار محلياً — الاتصال غير متاح ولم يتم الحفظ بعد.')); }
      }
      if(modal==='project'){
        const row:Project={id,name:form.name||'New Project',client:form.client||'',type:form.type||'Prefab',progress:Number(form.progress||10),manager:form.manager||'Eng. Omar',status:form.status||'In Factory',budget:Number(form.budget||100000),deadline:form.deadline||'2026-03-01'};
        if(isEdit){ setProjects(p=>p.map(x=>x.id===id?row:x)); const ok=await persistReplace('projects',id,row); setToast(ok?T(lang,'Project updated.','تم تحديث المشروع.'):T(lang,'Project updated locally — not saved yet.','تم تحديث المشروع محلياً ولم يُحفظ بعد.')); }
        else { setProjects(p=>[row,...p]); const ok=await persistCreate('projects',row); setToast(ok?T(lang,'Project saved.','تم حفظ المشروع.'):T(lang,'Project shown locally — not saved yet.','تم عرض المشروع محلياً ولم يتم الحفظ بعد.')); }
      }
      if(modal==='expense'){
        const row:Expense={id,label:form.label||'New expense',amount:Number(form.amount||0),category:form.category||'General'};
        if(isEdit){ setExpenses(p=>p.map(x=>x.id===id?row:x)); const ok=await persistReplace('expenses',id,row); setToast(ok?T(lang,'Expense updated.','تم تحديث المصروف.'):T(lang,'Expense updated locally — not saved yet.','تم تحديث المصروف محلياً ولم يُحفظ بعد.')); }
        else { setExpenses(p=>[row,...p]); const ok=await persistCreate('expenses',row); setToast(ok?T(lang,'Expense saved.','تم حفظ المصروف.'):T(lang,'Expense shown locally — not saved yet.','تم عرض المصروف محلياً ولم يتم الحفظ بعد.')); }
      }
      if(modal==='stock'){
        const row:Stock={id,item:form.item||'New item',category:form.category||'General',qty:Number(form.qty||0),unit:form.unit||'pcs',min:Number(form.min||10),status:form.status||(Number(form.qty||0)<=Number(form.min||10)?'Low':'OK')};
        if(isEdit){ setStock(p=>p.map(x=>x.id===id?row:x)); const ok=await persistReplace('inventory',id,row); setToast(ok?T(lang,'Stock updated.','تم تحديث المخزون.'):T(lang,'Stock updated locally — not saved yet.','تم تحديث المخزون محلياً ولم يُحفظ بعد.')); }
        else { setStock(p=>[row,...p]); const ok=await persistCreate('inventory',row); setToast(ok?T(lang,'Stock saved.','تم حفظ المخزون.'):T(lang,'Stock shown locally — not saved yet.','تم عرض المخزون محلياً ولم يتم الحفظ بعد.')); }
      }
      if(modal==='member'){
        const row:Member={id,name:form.name||'New Member',role:form.role||roles[0]||'Project Manager',phone:form.phone||'',email:form.email||'',password:'••••••'};
        if(isEdit){ setMembers(p=>p.map(x=>x.id===id?row:x)); const ok=await persistReplace('team_members',id,{...row,password:form.password||''}); setToast(ok?T(lang,'Member updated.','تم تحديث العضو.'):T(lang,'Member updated locally — not saved yet.','تم تحديث العضو محلياً ولم يُحفظ بعد.')); }
        else { setMembers(p=>[row,...p]); const ok=await persistCreate('team_members',{...row,password:form.password||''}); setToast(ok?T(lang,'Member added and saved.','تمت إضافة العضو وحفظه.'):T(lang,'Member shown locally — not saved yet.','تم عرض العضو محلياً ولم يتم الحفظ بعد.')); }
      }
      if(modal==='invoice'){
        const row:Invoice={id:isEdit?id:(form.id||('INV-'+String(Date.now()).slice(-4))),client:form.client||'',project:form.project||'',amount:Number(form.amount||0),due:form.due||'2026-02-01',status:form.status||'Pending'};
        if(isEdit){ setInvoices(p=>p.map(x=>x.id===id?row:x)); const ok=await persistReplace('invoices',id,row); setToast(ok?T(lang,'Invoice updated.','تم تحديث الفاتورة.'):T(lang,'Invoice updated locally — not saved yet.','تم تحديث الفاتورة محلياً ولم يُحفظ بعد.')); }
        else { setInvoices(p=>[row,...p]); const ok=await persistCreate('invoices',row); setToast(ok?T(lang,'Invoice saved.','تم حفظ الفاتورة.'):T(lang,'Invoice shown locally — not saved yet.','تم عرض الفاتورة محلياً ولم يتم الحفظ بعد.')); }
      }
      if(modal==='task'){
        const row:Task={id,text:form.text||'New task',time:form.time||'09:00',done:!!form.done};
        if(isEdit){ setTasks(p=>p.map(x=>x.id===id?row:x)); const ok=await persistReplace('followup_tasks',id,row); setToast(ok?T(lang,'Task updated.','تم تحديث المهمة.'):T(lang,'Task updated locally — not saved yet.','تم تحديث المهمة محلياً ولم يُحفظ بعد.')); }
        else { setTasks(p=>[row,...p]); const ok=await persistCreate('followup_tasks',row); setToast(ok?T(lang,'Task saved.','تم حفظ المهمة.'):T(lang,'Task shown locally — not saved yet.','تم عرض المهمة محلياً ولم يتم الحفظ بعد.')); }
      }
      if(modal==='broadcast'){
        const ok=await persistCreate('broadcasts',{id,message:form.message||'',audience:form.audience||'All leads',createdAt:new Date().toISOString()});
        setToast(ok?T(lang,'Broadcast recorded. Open WhatsApp to send it manually.','تم تسجيل الرسالة الجماعية. افتح واتساب لإرسالها يدوياً.'):T(lang,'Broadcast prepared locally — connection unavailable.','تم تجهيز الرسالة محلياً — الاتصال غير متاح.'));
      }
    } finally{ setBusy(false); setModal(''); setForm({}); setEditingId(null); setEditingKpi(null); setEditingRole(null); }
  }

  async function togglePerm(role:string,key:PermKey){
    const next={...perms[role],[key]:!perms[role][key]};
    setPerms(p=>({...p,[role]:next}));
    const value={role,perms:next};
    try{
      if(permIds[role]) await callApi('records.replace',{collection:'role_permissions',id:permIds[role],value});
      else { const rec=await callApi('records.create',{collection:'role_permissions',value,idempotency_key:`perm-${role}-${Date.now()}`}); setPermIds(p=>({...p,[role]:rec.id})); }
      setConn('connected');
    }catch(e){ setConn('unavailable'); setToast(T(lang,'Permission changed on screen — not saved, connection unavailable.','تم تغيير الصلاحية على الشاشة — لم يتم الحفظ، الاتصال غير متاح.')); }
  }

  async function toggleTask(task:Task){
    const next={...task,done:!task.done}; setTasks(p=>p.map(x=>x.id===task.id?next:x));
    await persistReplace('followup_tasks',task.id,next);
  }
  async function markPaid(inv:Invoice){ const next={...inv,status:'Paid'}; setInvoices(p=>p.map(x=>x.id===inv.id?next:x)); await persistReplace('invoices',inv.id,next); setToast(T(lang,`${inv.id} marked as paid.` ,`تم تحديد ${inv.id} كمدفوعة.`)); }
  function remind(inv:Invoice){ setToast(T(lang,`Reminder prepared for ${inv.client} — ${fmt(inv.amount)}.` ,`تم تجهيز تذكير لـ ${inv.client} — ${fmt(inv.amount)}.`)); }
  async function reorder(item:Stock){ const next={...item,qty:item.qty+Math.max(20,item.min),status:'OK'}; setStock(p=>p.map(x=>x.id===item.id?next:x)); await persistReplace('inventory',item.id,next); setToast(T(lang,`Reorder requested for ${item.item}.` ,`تم طلب إعادة تعبئة ${item.item}.`)); }

  const kpiMetaMap=kpiMeta(lang);
  const statusColor=(s:string):React.CSSProperties=> s==='New'?{background:'#FEF3C7',color:'#92400E'}: s==='Contacted'?{background:'#DBEAFE',color:'#1E40AF'}: s==='Quoted'?{background:'#E9D5FF',color:'#6B21A8'}: s==='Won'?{background:'#D1FAE5',color:'#065F46'}: s==='Lost'?{background:'#FEE2E2',color:'#991B1B'}: s==='On Site'?{background:'#DBEAFE',color:'#1E40AF'}: s==='In Factory'?{background:'#FEF3C7',color:'#92400E'}: s==='Delivered'?{background:'#D1FAE5',color:'#065F46'}: s==='Pending'?{background:'#FEF3C7',color:'#92400E'}: s==='Paid'?{background:'#D1FAE5',color:'#065F46'}: s==='Low'?{background:'#FEF3C7',color:'#92400E'}: s==='نشط'?{background:'#D1FAE5',color:'#065F46'}: s==='إجازة'?{background:'#DBEAFE',color:'#1E40AF'}: s==='موقوف'?{background:'#FEE2E2',color:'#991B1B'}: s==='حاضر'?{background:'#D1FAE5',color:'#065F46'}: s==='تم الصرف'?{background:'#D1FAE5',color:'#065F46'}: s==='معلق'?{background:'#FEF3C7',color:'#92400E'}: s==='تم'?{background:'#D1FAE5',color:'#065F46'}: {background:'#FEE2E2',color:'#991B1B'};

  const editBtn=(label?:string)=><span className="inline-flex items-center gap-1"><Pencil size={13}/>{label||T(lang,'Edit','تعديل')}</span>;
  const delBtn=(label?:string)=><span className="inline-flex items-center gap-1"><Trash2 size={13}/>{label||T(lang,'Delete','حذف')}</span>;
  const selectedDeptData=DEPT_DASHBOARDS.find(d=>d.id===selectedDept);

  // Place your real social media URLs here. This slot keeps the design and can be reused in the main website footer/index.
  const socialLinks=[
    {label:'Instagram',href:'https://instagram.com',icon:Instagram},
    {label:'Facebook',href:'https://facebook.com',icon:Facebook},
    {label:'LinkedIn',href:'https://linkedin.com',icon:Linkedin},
    {label:'Email',href:'mailto:info@alkader.com',icon:Mail},
  ];

  return (
    <div data-safe-area-inset-root style={{boxSizing:'border-box',paddingTop:'var(--safe-area-inset-top)',minHeight:'100vh',background:'var(--surface)'}} dir={dir}>
      <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)] overflow-x-clip">
        <header data-safe-area-sticky-top style={{top:'var(--safe-area-inset-top)'}} className="sticky z-40 bg-white/95 backdrop-blur border-b border-[var(--line)]">
          <div className="px-3 sm:px-5 lg:px-7 h-[68px] flex items-center gap-2 sm:gap-4">
            <button onClick={()=>setSidebarOpen(true)} className="btn-line lg:hidden !p-2" aria-label="Open menu"><Menu size={20}/></button>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#C9A227] text-white grid place-items-center font-display text-xl flex-none">A</div>
              <div className="leading-tight hidden sm:block">
                <div className="font-display text-[17px] sm:text-[20px] tracking-wide">ALKADER <span className="gold-text">ALMOHTARIF</span></div>
                <div className="text-[11px] text-[var(--muted)] font-bold tracking-widest">{T(lang,'OWNER DASHBOARD','لوحة تحكم المالك')}</div>
              </div>
            </div>
            <div className="flex-1 max-w-[560px] hidden md:block mx-2">
              <div className="relative"><Search className="absolute top-3 start-3 text-[#9A8B4F]" size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={T(lang,'Search projects, inquiries, clients…','ابحث في المشاريع والاستفسارات والعملاء…')} className="input !ps-10"/></div>
            </div>
            <div className="ms-auto flex items-center gap-2">
              <div className="hidden xl:flex items-center gap-1 border border-[var(--line)] rounded-full p-1 text-[13px] font-bold"><button onClick={()=>setLang('en')} className={`px-3 py-1.5 rounded-full ${lang==='en'?'bg-[#111] text-white':'text-[var(--muted)]'}`}>EN</button><span className="text-[#C9A227]">|</span><button onClick={()=>setLang('ar')} className={`px-3 py-1.5 rounded-full ${lang==='ar'?'bg-[#111] text-white':'text-[var(--muted)]'}`}>AR</button></div>
              <select value={branch} onChange={e=>setBranch(e.target.value)} className="input !w-auto hidden sm:block !py-2 text-[13px] font-bold"><option>Al-Rass — Head Office</option><option>Al-Qassim — One Branch</option></select>
              <div className="relative"><button onClick={()=>setShowNotif(v=>!v)} className="btn-line !p-2.5 relative" aria-label="Notifications"><Bell size={19}/><span className="absolute -top-1 -end-1 w-5 h-5 bg-[#C9A227] text-white text-[11px] rounded-full grid place-items-center font-bold">3</span></button>
                {showNotif && <div className="absolute top-12 end-0 w-[300px] max-w-[90vw] card p-3 z-50 shadow-2xl"><p className="font-extrabold text-sm mb-2">{T(lang,'Notifications','الإشعارات')}</p>{[T(lang,'New inquiry from Abdullah — Prefab villa','استفسار جديد من عبدالله — فيلا مسبقة الصنع'),T(lang,'Cement stock is below minimum','مخزون الأسمنت أقل من الحد الأدنى'),T(lang,'Invoice INV-2418 due in 3 days','فاتورة INV-2418 تستحق خلال 3 أيام')].map((n,i)=><div key={i} className="flex gap-2 py-2 border-b border-[#F0EAD0] last:border-0 text-[13px]"><BellRing size={16} className="text-[#C9A227] flex-none mt-0.5"/>{n}</div>)}</div>}
              </div>
              <div className="flex items-center gap-2 ps-1"><div className="w-10 h-10 rounded-full bg-black text-[#E8D48A] grid place-items-center font-extrabold">S</div><div className="hidden lg:block leading-tight"><div className="font-extrabold text-sm">Sabry</div><div className="text-[11px] text-[var(--muted)]">{T(lang,'Owner','المالك')} · {branch.split(' — ')[0]}</div></div></div>
            </div>
          </div>
          <div className="px-3 pb-2 md:hidden flex gap-2"><div className="relative flex-1"><Search className="absolute top-3 start-3 text-[#9A8B4F]" size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={T(lang,'Search…','بحث…')} className="input !ps-10"/></div><button onClick={()=>setLang(lang==='en'?'ar':'en')} className="btn-line flex items-center gap-1"><Globe size={16}/>{lang==='en'?'AR':'EN'}</button></div>
        </header>

        {conn==='unavailable' && <div className="mx-3 sm:mx-5 mt-3 bg-[#FFF7CC] border border-[#E7D99A] text-[13px] rounded-xl px-3 py-2 flex gap-2 items-start"><AlertTriangle size={17} className="flex-none mt-0.5 text-[#8A6D0A]"/>{T(lang,'Connection to the records service is unavailable. Changes are shown on screen and will need to be saved again once it returns.','الاتصال بخدمة السجلات غير متاح. تظهر التغييرات على الشاشة وستحتاج إلى حفظها مرة أخرى عند عودة الاتصال.')}</div>}

        <div className="flex items-start">
          <aside className="hidden lg:block w-[264px] flex-none sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto p-4">
            <div className="card !rounded-2xl p-4 mb-4 bg-[#FBF6DF]"><div className="flex items-center gap-2 text-[12px] font-extrabold tracking-widest text-[#8A6D0A]"><Sparkles size={15}/>{T(lang,'ONE BRANCH · ONE CONTROL','فرع واحد · تحكم واحد')}</div><p className="text-[13px] mt-2 leading-6 text-[#4A431F]">{T(lang,'Al-Rass is the head office. Al-Qassim operates under the same branch and the same owner control.','الرس هو المقر الرئيسي. تعمل القصيم تحت نفس الفرع ونفس تحكم المالك.')}</p></div>
            <nav className="space-y-1">{nav.map(n=>{const Icon=n.icon; const on=active===n.id; return <button key={n.id} onClick={()=>setActive(n.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start font-bold text-[14px] ${on?'bg-black text-white':'hover:bg-[#FBF6DF]'}`}><Icon size={19} className={on?'text-[#E8D48A]':'text-[#C9A227]'}/>{lang==='en'?n.en:n.ar}{on&&<span className="ms-auto w-2 h-2 rounded-full bg-[#C9A227]"/>}</button>})}</nav>
            <div className="mt-5 p-4 rounded-2xl border border-dashed border-[#C9A227]"><ShieldCheck className="text-[#C9A227]"/><p className="font-extrabold mt-2 text-sm">{T(lang,'Owner sees everything','المالك يرى كل شيء')}</p><p className="text-[12px] leading-5 text-[var(--muted)] mt-1">{T(lang,'Other roles see only what you allow in Team & Permissions.','الأدوار الأخرى ترى فقط ما تسمح به في الفريق والصلاحيات.')}</p></div>
          </aside>

          {sidebarOpen && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={()=>setSidebarOpen(false)}/><aside className="absolute top-0 bottom-0 start-0 w-[290px] max-w-[86vw] bg-white p-4 overflow-y-auto"><div className="flex justify-between items-center mb-4"><b className="font-display">ALKADER</b><button onClick={()=>setSidebarOpen(false)} className="btn-line !p-2"><X size={18}/></button></div><nav className="space-y-1">{nav.map(n=>{const Icon=n.icon; return <button key={n.id} onClick={()=>{setActive(n.id);setSidebarOpen(false)}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold ${active===n.id?'bg-black text-white':'bg-[#FBF6DF]'}`}><Icon size={19} className="text-[#C9A227]"/>{lang==='en'?n.en:n.ar}</button>})}</nav></aside></div>}

          <main className="flex-1 min-w-0 px-3 sm:px-5 lg:px-6 py-5 max-w-[1500px] mx-auto w-full">
            {showSection('dashboard') && <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div><p className="text-[12px] font-extrabold tracking-[0.18em] text-[#9A6A00]">{T(lang,'WELCOME BACK, SABRY','أهلاً بعودتك، صبري')}</p><h1 className="font-display text-[clamp(28px,4vw,44px)] leading-[1.05] mt-1">{T(lang,'Everything, under','كل شيء، تحت')} <span className="gold-text">{T(lang,'one control.','تحكم واحد.')}</span></h1><p className="text-[var(--muted)] mt-2 max-w-[640px] text-[14px] sm:text-[15px]">{T(lang,'Revenue, projects, money, stock, marketing and who can see what — managed from Al-Rass.','الإيرادات والمشاريع والمال والمخزون والتسويق ومن يرى ماذا — تُدار من الرس.')}</p></div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={()=>openAdd('project')} className="btn-gold flex items-center gap-1.5 text-sm"><Plus size={17}/>{T(lang,'Add Project','إضافة مشروع')}</button>
                  <button onClick={()=>openAdd('inquiry')} className="btn-line text-sm flex items-center gap-1"><Plus size={15}/>{T(lang,'Add Inquiry','إضافة استفسار')}</button>
                  <button onClick={()=>openAdd('invoice')} className="btn-line text-sm flex items-center gap-1"><Plus size={15}/>{T(lang,'Add Invoice','إضافة فاتورة')}</button>
                  <button onClick={()=>openAdd('expense')} className="btn-line text-sm">{T(lang,'Add Expense','إضافة مصروف')}</button>
                  <button onClick={()=>openAdd('stock')} className="btn-line text-sm">{T(lang,'Add Stock','إضافة مخزون')}</button>
                  <button onClick={()=>openAdd('member')} className="btn-line text-sm">{T(lang,'Add Member','إضافة عضو')}</button>
                  <button onClick={()=>openAdd('task')} className="btn-line text-sm flex items-center gap-1"><Plus size={15}/>{T(lang,'Add Task','إضافة مهمة')}</button>
                  <button onClick={()=>openAdd('employee')} className="btn-line text-sm flex items-center gap-1"><Plus size={15}/>{T(lang,'Add Employee','إضافة موظف')}</button>
                  <button onClick={()=>openAdd('broadcast')} className="btn-line text-sm flex items-center gap-1.5 bg-[#25D366]/10 border-[#25D366]/30"><MessageCircle size={17} className="text-[#177245]"/>{T(lang,'Send Broadcast','إرسال رسالة جماعية')}</button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mt-5">
                {kpis.map((k)=>{ const meta=kpiMetaMap[k.key]; if(!meta) return null; const KIcon=meta.icon; return <div key={k.key} className="card p-4"><div className="flex justify-between items-start"><span className="w-9 h-9 rounded-xl bg-[#FBF6DF] grid place-items-center text-[#9A6A00]"><KIcon size={18}/></span><span className={`flex items-center gap-0.5 text-[12px] font-extrabold ${k.up?'text-[#177245]':'text-[#B42318]'}`}>{k.up?<ArrowUpRight size={15}/>:<ArrowDownRight size={15}/>}{k.trend}</span></div><div className="text-[clamp(14px,4vw,24px)] font-black mt-3 leading-tight break-words" style={{overflowWrap:'anywhere'}}>{k.value}</div><div className="text-[12px] font-bold mt-2 leading-4">{meta.label}</div><div className="text-[11px] text-[var(--muted)] mt-1">{meta.note}</div><button onClick={()=>openKpiEdit(k)} className="btn-line !py-1.5 !px-2.5 text-[12px] mt-3">{editBtn()}</button></div>})}
              </div>
            </section>}

            {showSection('dashboard') && <section className="grid lg:grid-cols-5 gap-4 mt-4">
              <div className="card p-4 sm:p-5 lg:col-span-3"><div className="flex justify-between items-center"><div><h2 className="font-display text-[21px]">{T(lang,'Revenue by month','الإيرادات حسب الشهر')}</h2><p className="text-[12px] text-[var(--muted)]">{T(lang,'January to November · SAR','من يناير إلى نوفمبر · ريال سعودي')}</p></div><span className="chip bg-[#FBF6DF] text-[#8A6D0A]">2025</span></div>
                <div className="flex items-end gap-1.5 sm:gap-2.5 h-[190px] mt-6 border-b border-[#EDE7CE] pb-0">{revenueMonths.map((v,i)=><div key={i} className="flex-1 flex flex-col items-center gap-1.5 group"><div className="text-[10px] sm:text-[11px] font-bold opacity-0 group-hover:opacity-100">{(v/1000).toFixed(0)}k</div><div title={`${monthNames[i]}: SAR ${v},000`} className="w-full max-w-[34px] rounded-t-lg bg-gradient-to-t from-[#8A6D0A] via-[#C9A227] to-[#E8D48A] hover:brightness-110" style={{height:`${v/1240*155}px`}}/><span className="text-[10px] sm:text-[11px] font-bold text-[var(--muted)]">{monthNames[i]}</span></div>)}</div>
              </div>
              <div className="card p-4 sm:p-5 lg:col-span-2"><h2 className="font-display text-[21px]">{T(lang,'Project status','حالة المشاريع')}</h2><p className="text-[12px] text-[var(--muted)]">{T(lang,'47 projects tracked','47 مشروعاً قيد المتابعة')}</p>
                <div className="flex items-center gap-5 mt-4"><div className="relative w-[132px] h-[132px] flex-none"><svg viewBox="0 0 120 120" className="w-full h-full -rotate-90"><circle cx="60" cy="60" r="48" fill="none" stroke="#F0EAD0" strokeWidth="18"/><circle cx="60" cy="60" r="48" fill="none" stroke="#C9A227" strokeWidth="18" strokeDasharray={`${6/47*301} 301`} strokeDashoffset="0"/><circle cx="60" cy="60" r="48" fill="none" stroke="#111" strokeWidth="18" strokeDasharray={`${7/47*301} 301`} strokeDashoffset={`${-6/47*301}`}/><circle cx="60" cy="60" r="48" fill="none" stroke="#E8D48A" strokeWidth="18" strokeDasharray={`${32/47*301} 301`} strokeDashoffset={`${-13/47*301}`}/><circle cx="60" cy="60" r="48" fill="none" stroke="#B42318" strokeWidth="18" strokeDasharray={`${2/47*301} 301`} strokeDashoffset={`${-45/47*301}`}/></svg><div className="absolute inset-0 grid place-items-center text-center"><div><div className="text-2xl font-black">47</div><div className="text-[11px] text-[var(--muted)] font-bold">{T(lang,'Projects','مشروع')}</div></div></div></div>
                <ul className="space-y-2.5 text-[13px] font-bold flex-1">{[[T(lang,'In Factory','في المصنع'),6,'#C9A227'],[T(lang,'On Site','في الموقع'),7,'#111'],[T(lang,'Delivered','تم التسليم'),32,'#E8D48A'],[T(lang,'Delayed','متأخر'),2,'#B42318']].map(([label,val,color]:any)=><li key={label} className="flex justify-between gap-2"><span className="flex items-center gap-2"><i className="w-2.5 h-2.5 rounded-full flex-none" style={{background:color}}></i>{label}</span><b>{val}</b></li>)}</ul></div>
                <div className="mt-4 bg-[#FFF7CC] border border-[#E7D99A] rounded-xl p-3 text-[13px] flex gap-2"><AlertTriangle size={17} className="text-[#8A6D0A] flex-none"/>{T(lang,'2 delayed projects need your review this week.','مشروعان متأخران يحتاجان إلى مراجعتك هذا الأسبوع.')}</div>
              </div>
            </section>}

            {/* ============ EMPLOYEES & PAYROLL ============ */}
            {showSection('employees') && <section className="mt-4">
              <div className="flex flex-wrap justify-between gap-3 items-end">
                <div><p className="text-[12px] font-extrabold tracking-[0.18em] text-[#9A6A00]">★ {T(lang,'MOST IMPORTANT FOR THE OWNER','الأهم لصاحب المنشأة')}</p>
                <h2 className="font-display text-[clamp(24px,3vw,34px)] mt-1">{T(lang,'Employees & Payroll','الموظفين والرواتب')}</h2>
                <p className="text-[var(--muted)] text-sm mt-1 max-w-[760px]">{T(lang,'Everyone in one place: accounts, accountants, HR, marketing, warehouse, operations, reception, engineers and workers — and their salaries.','الجميع في مكان واحد: الحسابات والمحاسبون وشؤون الموظفين والتسويق والمخازن والتشغيل والاستقبال والمهندسون والعمال — ورواتبهم.')}</p></div>
                <div className="flex gap-2 flex-wrap"><button onClick={()=>openAdd('employee')} className="btn-gold flex items-center gap-1.5 text-sm"><Plus size={16}/>{T(lang,'Add Employee','إضافة موظف')}</button><button onClick={()=>openAdd('payroll')} className="btn-line text-sm flex items-center gap-1"><Plus size={15}/>{T(lang,'Add Payroll Row','إضافة سطر راتب')}</button><button onClick={payAllSalaries} disabled={busy} className="btn-line text-sm flex items-center gap-1 disabled:opacity-60"><Banknote size={16}/>{T(lang,'Pay All Salaries','صرف كل الرواتب')}</button></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mt-4">
                {[
                  {label:T(lang,'Total Employees','إجمالي الموظفين'),value:String(totalEmployees),note:T(lang,'All departments','كل الأقسام'),icon:Users},
                  {label:T(lang,'Total Monthly Salaries','إجمالي الرواتب الشهرية'),value:fmt(totalSalaries),note:T(lang,'January 2026','يناير 2026'),icon:Banknote},
                  {label:T(lang,'Paid This Month','تم صرفه هذا الشهر'),value:fmt(paidSalaries),note:T(lang,'From payroll','من كشف الرواتب'),icon:CheckCircle2},
                  {label:T(lang,'Remaining to Pay','متبقي صرف'),value:fmt(remainingSalaries),note:T(lang,'Pending payroll','رواتب معلّقة'),icon:Wallet},
                  {label:T(lang,'Workers On Site Today','عمال في الموقع اليوم'),value:String(onSiteToday),note:T(lang,'Workers + engineers + operations','عمال + مهندسون + تشغيل'),icon:Factory},
                  {label:T(lang,'On Leave Today','إجازة اليوم'),value:String(onLeaveToday),note:T(lang,'From attendance','من الحضور'),icon:CalendarDays},
                ].map(c=>{const CI=c.icon; return <div key={c.label} className="card p-4"><div className="flex justify-between items-start"><span className="w-9 h-9 rounded-xl bg-[#FBF6DF] grid place-items-center text-[#9A6A00]"><CI size={18}/></span></div><div className="text-[clamp(14px,4vw,22px)] font-black mt-3 leading-tight break-words" style={{overflowWrap:'anywhere'}}>{c.value}</div><div className="text-[12px] font-bold mt-2 leading-4">{c.label}</div><div className="text-[11px] text-[var(--muted)] mt-1">{c.note}</div></div>})}
              </div>

              {/* Accounts manager wallet + transfers */}
              <div className="grid lg:grid-cols-5 gap-4 mt-4">
                <div className="card p-4 sm:p-5 lg:col-span-2 bg-[#FBF6DF]">
                  <div className="flex justify-between items-start gap-2"><div><p className="text-[11px] font-extrabold tracking-widest text-[#8A6D0A]">{T(lang,'ACCOUNTS MANAGER WALLET','محفظة مدير الحسابات')}</p><h3 className="font-display text-[22px] mt-1">{T(lang,'Accounts Manager Wallet','محفظة مدير الحسابات')}</h3><p className="text-[13px] text-[var(--muted)] mt-1">Ahmed Al-Harbi · {T(lang,'Accounts Manager','مدير الحسابات')}</p></div><Wallet className="text-[#C9A227]" size={26}/></div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white border border-[var(--line)] rounded-2xl p-3"><div className="text-[11px] font-bold text-[var(--muted)]">{T(lang,'ACCOUNTS BALANCE','رصيد مدير الحسابات')}</div><div className="text-[18px] font-black mt-1 break-words">{fmt(accountsBalance)}</div><div className="text-[11px] text-[var(--muted)] mt-1">{T(lang,'Current balance','الرصيد الحالي')}</div></div>
                    <div className="bg-white border border-[var(--line)] rounded-2xl p-3"><div className="text-[11px] font-bold text-[var(--muted)]">{T(lang,'OWNER BALANCE','رصيد المالك')}</div><div className="text-[18px] font-black mt-1 break-words">{fmt(ownerBalance)}</div><div className="text-[11px] text-[var(--muted)] mt-1">{T(lang,'Deducted on transfer','يُخصم عند التحويل')}</div></div>
                  </div>
                  <p className="text-[13px] leading-6 mt-3">{T(lang,'Transfer from the owner to the accounts manager for salaries, factory expenses, materials or advances.','حوّل من المالك لمدير الحسابات للرواتب أو مصاريف المصنع أو شراء الخامات أو السلف.')}</p>
                  <button onClick={()=>openTransferFor(employees.find(e=>e.role==='مدير الحسابات')||employees[0])} className="btn-gold w-full mt-3 flex items-center justify-center gap-2"><ArrowLeftRight size={17}/>{T(lang,'Transfer Money','تحويل أموال')}</button>
                  <p className="text-[11px] text-[var(--muted)] mt-2">{T(lang,'Transfer deducts from the owner balance and adds to the accounts manager balance.','التحويل يخصم من رصيد المالك ويضيف لرصيد مدير الحسابات.')}</p>
                </div>
                <div className="card p-4 sm:p-5 lg:col-span-3">
                  <div className="flex justify-between items-center gap-2 flex-wrap"><h3 className="font-display text-[20px]">{T(lang,'Transfers History','سجل التحويلات')}</h3><button onClick={()=>openTransferFor(employees.find(e=>e.role==='مدير الحسابات')||employees[0])} className="btn-line !py-2 text-[12px] flex items-center gap-1"><Plus size={14}/>{T(lang,'New Transfer','تحويل جديد')}</button></div>
                  <div className="overflow-x-auto scroll-thin mt-2"><table className="w-full min-w-[620px] text-sm"><thead><tr className="bg-[#FBF6DF]"><th>{T(lang,'Date','التاريخ')}</th><th>{T(lang,'Amount','المبلغ')}</th><th>{T(lang,'To','إلى')}</th><th>{T(lang,'Reason','السبب')}</th><th>{T(lang,'Status','الحالة')}</th><th>{T(lang,'Actions','إجراءات')}</th></tr></thead><tbody>
                    {transfers.map(tr=><tr key={tr.id}><td className="whitespace-nowrap">{tr.date}</td><td className="font-bold whitespace-nowrap">{fmt(tr.amount)}</td><td className="min-w-[170px] break-words">{tr.to}</td><td>{tr.reason}</td><td><span className="chip" style={statusColor(tr.status)}>{tr.status}</span></td><td><div className="flex gap-1.5 whitespace-nowrap"><button onClick={()=>openEdit('transfer',tr)} className="btn-line !py-1.5 !px-2.5 text-[12px]">{editBtn()}</button><button onClick={()=>requestDelete('transfer',tr.id,`${fmt(tr.amount)} — ${tr.reason}`,'transfers')} className="btn-line !py-1.5 !px-2.5 text-[12px] !text-[#B42318]">{delBtn()}</button></div></td></tr>)}
                    {transfers.length===0 && <tr><td colSpan={6} className="text-center py-6 text-[var(--muted)]">{T(lang,'No transfers yet.','لا توجد تحويلات بعد.')}</td></tr>}
                  </tbody></table></div>
                </div>
              </div>

              {/* Employees table */}
              <div className="card mt-4 overflow-hidden">
                <div className="p-4 sm:p-5 flex flex-wrap justify-between gap-3 items-center"><div><h3 className="font-display text-[22px]">{T(lang,'Employees','الموظفون')}</h3><p className="text-[12px] text-[var(--muted)]">{T(lang,'All staff — salaries, attendance and status.','كل الموظفين — الرواتب والحضور والحالة.')}</p></div><div className="flex flex-wrap gap-2"><div className="relative"><Search className="absolute top-2.5 start-3 text-[#9A8B4F]" size={16}/><input value={empSearch} onChange={e=>setEmpSearch(e.target.value)} placeholder={T(lang,'Search employees…','ابحث في الموظفين…')} className="input !ps-9 !py-2 !w-[200px]"/></div><select value={empFilter} onChange={e=>setEmpFilter(e.target.value)} className="input !w-auto !py-2"><option>All</option><option>نشط</option><option>إجازة</option><option>موقوف</option><option>المالية</option><option>التسويق</option><option>المخازن</option><option>التشغيل</option><option>العمال</option><option>المصنع</option><option>الاستقبال</option><option>الموارد البشرية</option></select><button onClick={()=>openAdd('employee')} className="btn-gold !py-2.5 text-sm flex items-center gap-1"><Plus size={16}/>{T(lang,'Add Employee','إضافة موظف')}</button></div></div>
                <div className="overflow-x-auto scroll-thin"><table className="w-full min-w-[1180px] text-sm"><thead><tr className="bg-[#FBF6DF]"><th>{T(lang,'Name','الاسم')}</th><th>{T(lang,'Role / Department','الوظيفة / القسم')}</th><th>{T(lang,'Phone','الهاتف')}</th><th>{T(lang,'Monthly Salary','الراتب الشهري')}</th><th>{T(lang,'Hire Date','تاريخ التعيين')}</th><th>{T(lang,'Status','الحالة')}</th><th>{T(lang,'Today Attendance','الحضور اليوم')}</th><th>{T(lang,'Actions','إجراءات')}</th></tr></thead><tbody>
                  {filteredEmployees.map(x=><tr key={x.id}><td className="font-bold"><span className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-[#FBF6DF] grid place-items-center text-[12px] font-black text-[#8A6D0A] flex-none">{x.name[0]}</span>{x.name}</span></td><td><b>{x.role}</b><span className="block text-[11px] text-[var(--muted)]">{x.dept}</span></td><td dir="ltr" className="whitespace-nowrap text-[var(--muted)]">{x.phone}</td><td className="font-bold whitespace-nowrap">{fmt(x.salary)}</td><td className="whitespace-nowrap">{x.hireDate}</td><td><span className="chip" style={statusColor(x.status)}>{x.status}</span></td><td><span className="chip" style={statusColor(x.attendance)}>{x.attendance}</span></td><td><div className="flex gap-1.5 whitespace-nowrap flex-wrap"><button onClick={()=>openEdit('employee',x)} className="btn-line !py-1.5 !px-2.5 text-[12px]">{editBtn()}</button><button onClick={()=>requestDelete('employee',x.id,x.name,'employees')} className="btn-line !py-1.5 !px-2.5 text-[12px] !text-[#B42318]">{delBtn()}</button><button onClick={()=>paySalaryForEmployee(x)} disabled={busy} className="btn-gold !py-1.5 !px-3 text-[12px] flex items-center gap-1 disabled:opacity-60"><Banknote size={13}/>{T(lang,'Pay Salary','صرف راتب')}</button>{x.role==='مدير الحسابات' && <button onClick={()=>openTransferFor(x)} className="btn-line !py-1.5 !px-3 text-[12px] flex items-center gap-1 !border-[#C9A227] bg-[#FBF6DF]"><ArrowLeftRight size={13}/>{T(lang,'Transfer','تحويل')}</button>}</div></td></tr>)}
                  {filteredEmployees.length===0 && <tr><td colSpan={8} className="text-center py-8 text-[var(--muted)]">{T(lang,'No employees match your search / filter.','لا يوجد موظفون مطابقون لبحثك / مرشحك.')}</td></tr>}
                </tbody></table></div>
              </div>

              {/* Payroll table */}
              <div className="card mt-4 overflow-hidden">
                <div className="p-4 sm:p-5 flex flex-wrap justify-between gap-3 items-center"><div><h3 className="font-display text-[22px]">{T(lang,'Payroll','كشف الرواتب')}</h3><p className="text-[12px] text-[var(--muted)]">{T(lang,'Base + extra / deduction = net. Pay one, or pay all at once.','الأساسي + إضافي / خصم = الصافي. اصرف واحداً أو اصرف الكل مرة واحدة.')}</p></div><div className="flex flex-wrap gap-2"><div className="relative"><Search className="absolute top-2.5 start-3 text-[#9A8B4F]" size={16}/><input value={payrollSearch} onChange={e=>setPayrollSearch(e.target.value)} placeholder={T(lang,'Search payroll…','ابحث في الرواتب…')} className="input !ps-9 !py-2 !w-[200px]"/></div><select value={payrollFilter} onChange={e=>setPayrollFilter(e.target.value)} className="input !w-auto !py-2"><option>All</option><option>تم الصرف</option><option>معلق</option></select><button onClick={payAllSalaries} disabled={busy} className="btn-gold !py-2.5 text-sm flex items-center gap-1 disabled:opacity-60"><Banknote size={15}/>{T(lang,'Pay All Salaries','صرف كل الرواتب')}</button><button onClick={()=>openAdd('payroll')} className="btn-line !py-2.5 text-sm flex items-center gap-1"><Plus size={15}/>{T(lang,'Add Payroll','إضافة راتب')}</button></div></div>
                <div className="overflow-x-auto scroll-thin"><table className="w-full min-w-[980px] text-sm"><thead><tr className="bg-[#FBF6DF]"><th>{T(lang,'Month','الشهر')}</th><th>{T(lang,'Employee','الموظف')}</th><th>{T(lang,'Base Salary','الراتب الأساسي')}</th><th>{T(lang,'Extra / Deduction','إضافي / خصم')}</th><th>{T(lang,'Net','الصافي')}</th><th>{T(lang,'Status','الحالة')}</th><th>{T(lang,'Actions','إجراءات')}</th></tr></thead><tbody>
                  {filteredPayroll.map(p=><tr key={p.id}><td className="whitespace-nowrap">{p.month}</td><td className="font-bold">{p.employee}</td><td className="whitespace-nowrap">{fmt(p.base)}</td><td className="whitespace-nowrap">{p.adjustment===0?'—':fmt(p.adjustment)}</td><td className="font-bold whitespace-nowrap">{fmt(p.net)}</td><td><span className="chip" style={statusColor(p.status)}>{p.status}</span></td><td><div className="flex gap-1.5 whitespace-nowrap flex-wrap">{p.status!=='تم الصرف' && <button onClick={()=>payPayrollRow(p)} disabled={busy} className="btn-gold !py-1.5 !px-3 text-[12px] flex items-center gap-1 disabled:opacity-60"><Banknote size={13}/>{T(lang,'Pay','صرف')}</button>}<button onClick={()=>openEdit('payroll',p)} className="btn-line !py-1.5 !px-2.5 text-[12px]">{editBtn()}</button><button onClick={()=>requestDelete('payroll',p.id,p.employee,'payroll_records')} className="btn-line !py-1.5 !px-2.5 text-[12px] !text-[#B42318]">{delBtn()}</button></div></td></tr>)}
                  {filteredPayroll.length===0 && <tr><td colSpan={7} className="text-center py-8 text-[var(--muted)]">{T(lang,'No payroll rows match your search / filter.','لا توجد سطور رواتب مطابقة لبحثك / مرشحك.')}</td></tr>}
                </tbody></table></div>
                <div className="px-4 py-3 bg-[#FBF6DF] text-[12px] text-[var(--muted)] flex flex-wrap gap-2 justify-between"><span>{T(lang,'Paid','تم صرفه')}: <b className="text-[var(--ink)]">{fmt(paidSalaries)}</b> · {T(lang,'Remaining','متبقي')}: <b className="text-[var(--ink)]">{fmt(remainingSalaries)}</b></span><span>{T(lang,'Paying a salary marks it paid and updates the remaining amount above.','صرف الراتب يحدّثه كمدفوع ويحدّث المتبقي أعلاه.')}</span></div>
              </div>
            </section>}

            {/* ============ DEPARTMENT DASHBOARDS ============ */}
            {showSection('departments') && <section className="mt-4">
              <div className="flex flex-wrap justify-between gap-3 items-end"><div><p className="text-[12px] font-extrabold tracking-[0.18em] text-[#9A6A00]">{T(lang,'ONE OWNER · MULTI DEPARTMENT VIEW','مالك واحد · عرض متعدد للأقسام')}</p><h2 className="font-display text-[clamp(24px,3vw,34px)] mt-1">{T(lang,'Department Dashboards','لوحات الأقسام')}</h2><p className="text-[var(--muted)] text-sm mt-1 max-w-[760px]">{T(lang,'The owner sees everything. Each department has its own dashboard and can be controlled from the main dashboard permissions matrix.','صاحب المنشأة يرى كل شيء. لكل قسم لوحة خاصة به ويمكن التحكم بها من مصفوفة الصلاحيات في اللوحة الرئيسية.')}</p></div></div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
                {DEPT_DASHBOARDS.map(d=>{const DI=d.icon; return <article key={d.id} className="card p-4"><div className="flex justify-between items-start"><span className="w-11 h-11 rounded-2xl bg-[#FBF6DF] grid place-items-center text-[#9A6A00]"><DI size={22}/></span><span className="chip bg-[#FBF6DF] text-[#8A6D0A]">{T(lang,'Live','مباشر')}</span></div><h3 className="font-extrabold text-[17px] mt-3 leading-6">{d.title}</h3><p className="text-[13px] text-[var(--muted)] leading-6 mt-1">{d.desc}</p><div className="flex flex-wrap gap-1.5 mt-3">{d.items.map(it=><span key={it} className="chip bg-[#FAF8F0] border border-[var(--line)] !text-[var(--ink)]">{it}</span>)}</div><button onClick={()=>setSelectedDept(selectedDept===d.id?null:d.id)} className="btn-line w-full mt-4 text-sm flex items-center justify-center gap-1"><Eye size={15}/>{T(lang,'Open dashboard','فتح اللوحة')}</button>{selectedDept===d.id && <div className="mt-3 bg-[#FBF6DF] rounded-xl p-3 text-[13px] leading-6"><b>{d.title}</b><br/>{d.items.join(' · ')}<br/><span className="text-[var(--muted)]">{T(lang,'Owner sees all departments. Manager sees only the selected dashboard.','صاحب المنشأة يرى كل اللوحات. المدير يرى لوحته المختارة فقط.')}</span></div>}</article>})}
              </div>

              {selectedDeptData && <div className="card mt-4 overflow-hidden border-2 !border-[#C9A227]">
                <div className="p-4 sm:p-5 bg-black text-white flex flex-wrap justify-between gap-3 items-center"><div><h3 className="font-display text-[22px]">{selectedDeptData.title}</h3><p className="text-[13px] text-[#E8D48A] mt-1">{selectedDeptData.desc}</p></div><button onClick={()=>setActive('team')} className="btn-gold text-sm flex items-center gap-1"><ShieldCheck size={16}/>{T(lang,'Manage Roles','إدارة الصلاحيات')}</button></div>
                <div className="p-4 sm:p-5">
                  {selectedDeptData.id==='accounts-manager' && <div className="space-y-4"><div className="grid sm:grid-cols-4 gap-3">{[[T(lang,'Owner Balance','رصيد المالك'),fmt(ownerBalance)],[T(lang,'Accounts Balance','رصيد مدير الحسابات'),fmt(accountsBalance)],[T(lang,'Pending Payroll','رواتب معلقة'),fmt(remainingSalaries)],[T(lang,'Expenses','المصاريف'),fmt(totalExpenses)]].map(([label,val]:any)=><div key={label} className="border border-[var(--line)] rounded-2xl p-3"><div className="text-[11px] font-bold text-[var(--muted)]">{label}</div><div className="text-[20px] font-black mt-1">{val}</div></div>)}</div><div className="grid lg:grid-cols-2 gap-4"><div className="border border-[var(--line)] rounded-2xl p-4"><h4 className="font-extrabold text-[16px] mb-3">{T(lang,'Latest Transfers','آخر التحويلات')}</h4><div className="space-y-2">{transfers.slice(0,4).map(tr=><div key={tr.id} className="flex justify-between gap-2 border-b border-[#F0EAD0] pb-2"><div><b>{tr.reason}</b><div className="text-[12px] text-[var(--muted)]">{tr.date} · {tr.to}</div></div><div className="text-right"><div className="font-black">{fmt(tr.amount)}</div><span className="chip" style={statusColor(tr.status)}>{tr.status}</span></div></div>)}</div></div><div className="border border-[var(--line)] rounded-2xl p-4"><h4 className="font-extrabold text-[16px] mb-3">{T(lang,'Recent Expenses','المصاريف الأخيرة')}</h4><div className="space-y-2">{expenses.slice(0,4).map(e=><div key={e.id} className="flex justify-between gap-2 border-b border-[#F0EAD0] pb-2"><div><b>{e.label}</b><div className="text-[12px] text-[var(--muted)]">{e.category}</div></div><div className="font-black">{fmt(e.amount)}</div></div>)}</div></div></div></div>}

                  {selectedDeptData.id==='accountant' && <div className="space-y-4"><div className="grid sm:grid-cols-3 gap-3">{[[T(lang,'Income','الدخل'),fmt(totalIncome)],[T(lang,'Profit','الربح'),fmt(profit)],[T(lang,'Pending Invoices','الفواتير المعلقة'),String(filteredInv.filter(i=>i.status==='Pending').length)]].map(([label,val]:any)=><div key={label} className="border border-[var(--line)] rounded-2xl p-3"><div className="text-[11px] font-bold text-[var(--muted)]">{label}</div><div className="text-[20px] font-black mt-1">{val}</div></div>)}</div><div className="grid lg:grid-cols-2 gap-4"><div className="border border-[var(--line)] rounded-2xl p-4"><h4 className="font-extrabold text-[16px] mb-3">{T(lang,'Invoice List','قائمة الفواتير')}</h4>{invoices.slice(0,4).map(inv=><div key={inv.id} className="flex justify-between py-2 border-b border-[#F0EAD0]"><div><b>{inv.id}</b><div className="text-[12px] text-[var(--muted)]">{inv.client}</div></div><div className="text-right"><div className="font-black">{fmt(inv.amount)}</div><span className="chip" style={statusColor(inv.status)}>{inv.status}</span></div></div>)}</div><div className="border border-[var(--line)] rounded-2xl p-4"><h4 className="font-extrabold text-[16px] mb-3">{T(lang,'Expenses Review','مراجعة المصاريف')}</h4>{expenses.map(e=><div key={e.id} className="flex justify-between py-2 border-b border-[#F0EAD0]"><div><b>{e.label}</b><div className="text-[12px] text-[var(--muted)]">{e.category}</div></div><div className="font-black">{fmt(e.amount)}</div></div>)}</div></div></div>}

                  {selectedDeptData.id==='operations' && <div className="space-y-4"><div className="grid sm:grid-cols-3 gap-3">{[[T(lang,'Active Projects','المشاريع النشطة'),String(projects.length)],[T(lang,'Workers onsite','العمال في الموقع'),String(onSiteToday)],[T(lang,'Tasks today','المهام اليوم'),String(tasks.filter(t=>!t.done).length)]].map(([label,val]:any)=><div key={label} className="border border-[var(--line)] rounded-2xl p-3"><div className="text-[11px] font-bold text-[var(--muted)]">{label}</div><div className="text-[20px] font-black mt-1">{val}</div></div>)}</div><div className="grid lg:grid-cols-2 gap-4"><div className="border border-[var(--line)] rounded-2xl p-4"><h4 className="font-extrabold text-[16px] mb-3">{T(lang,'Project Updates','تحديثات المشاريع')}</h4>{projects.slice(0,4).map(proj=><div key={proj.id} className="py-2 border-b border-[#F0EAD0]"><div className="flex justify-between"><b>{proj.name}</b><span className="chip" style={statusColor(proj.status)}>{proj.status}</span></div><div className="text-[12px] text-[var(--muted)] mt-1">{proj.client} · {proj.manager}</div><div className="h-2 mt-2 bg-[#F0EAD0] rounded-full overflow-hidden"><div className="h-full bg-[#C9A227]" style={{width:`${proj.progress}%`}} /></div></div>)}</div><div className="border border-[var(--line)] rounded-2xl p-4"><h4 className="font-extrabold text-[16px] mb-3">{T(lang,'Today Tasks','مهام اليوم')}</h4>{filteredTasks.slice(0,5).map(task=><div key={task.id} className="flex justify-between gap-2 py-2 border-b border-[#F0EAD0]"><span className={`${task.done ? 'line-through text-[var(--muted)]' : 'font-semibold'}`}>{task.text}</span><span className="text-[12px] text-[var(--muted)]">{task.time}</span></div>)}</div></div></div>}

                  {selectedDeptData.id==='warehouse-manager' && <div className="space-y-4"><div className="grid sm:grid-cols-3 gap-3">{[[T(lang,'Low Stock Items','عناصر المخزون المنخفض'),String(stock.filter(s=>s.status==='Low').length)],[T(lang,'Total Items','إجمالي العناصر'),String(stock.length)],[T(lang,'Reorders Needed','طلبات إعادة تعبئة'),String(stock.filter(s=>s.status==='Low').length)]].map(([label,val]:any)=><div key={label} className="border border-[var(--line)] rounded-2xl p-3"><div className="text-[11px] font-bold text-[var(--muted)]">{label}</div><div className="text-[20px] font-black mt-1">{val}</div></div>)}</div><div className="border border-[var(--line)] rounded-2xl p-4"><h4 className="font-extrabold text-[16px] mb-3">{T(lang,'Stock Status','حالة المخزون')}</h4>{stock.slice(0,6).map(item=><div key={item.id} className="flex justify-between gap-3 py-2 border-b border-[#F0EAD0]"><div><b>{item.item}</b><div className="text-[12px] text-[var(--muted)]">{item.category}</div></div><div className="text-right"><div className="font-black">{item.qty} {item.unit}</div><span className="chip" style={item.status==='Low'?{background:'#FEF3C7',color:'#92400E'}:{background:'#D1FAE5',color:'#065F46'}}>{item.status}</span></div></div>)}</div></div>}

                  {selectedDeptData.id==='marketing-manager' && <div className="space-y-4"><div className="grid sm:grid-cols-3 gap-3">{[[T(lang,'New Leads','عملاء جدد'),String(inquiries.filter(i=>i.status==='New').length)],[T(lang,'Quoted','تم التسعير'),String(inquiries.filter(i=>i.status==='Quoted').length)],[T(lang,'Won','فاز'),String(inquiries.filter(i=>i.status==='Won').length)]].map(([label,val]:any)=><div key={label} className="border border-[var(--line)] rounded-2xl p-3"><div className="text-[11px] font-bold text-[var(--muted)]">{label}</div><div className="text-[20px] font-black mt-1">{val}</div></div>)}</div><div className="grid lg:grid-cols-2 gap-4"><div className="border border-[var(--line)] rounded-2xl p-4"><h4 className="font-extrabold text-[16px] mb-3">{T(lang,'Lead Funnel','قمع العملاء')}</h4>{inquiries.slice(0,5).map(item=><div key={item.id} className="flex justify-between py-2 border-b border-[#F0EAD0]"><div><b>{item.name}</b><div className="text-[12px] text-[var(--muted)]">{item.service} · {item.city}</div></div><span className="chip" style={statusColor(item.status)}>{item.status}</span></div>)}</div><div className="border border-[var(--line)] rounded-2xl p-4"><h4 className="font-extrabold text-[16px] mb-3">{T(lang,'Follow-up Tasks','مهام المتابعة')}</h4>{filteredTasks.slice(0,5).map(task=><div key={task.id} className="flex justify-between py-2 border-b border-[#F0EAD0]"><span className={`${task.done ? 'line-through text-[var(--muted)]' : 'font-semibold'}`}>{task.text}</span><span className="text-[12px] text-[var(--muted)]">{task.time}</span></div>)}</div></div></div>}

                  {selectedDeptData.id==='reception' && <div className="space-y-4"><div className="grid sm:grid-cols-3 gap-3">{[[T(lang,'Pending Requests','الطلبات المعلقة'),String(inquiries.filter(i=>i.status==='New'||i.status==='Contacted').length)],[T(lang,'Total Requests','إجمالي الطلبات'),String(inquiries.length)],[T(lang,'Assigned Today','مخصص اليوم'),String(inquiries.filter(i=>i.status==='Contacted').length)]].map(([label,val]:any)=><div key={label} className="border border-[var(--line)] rounded-2xl p-3"><div className="text-[11px] font-bold text-[var(--muted)]">{label}</div><div className="text-[20px] font-black mt-1">{val}</div></div>)}</div><div className="border border-[var(--line)] rounded-2xl p-4"><h4 className="font-extrabold text-[16px] mb-3">{T(lang,'Latest Requests','آخر الطلبات')}</h4>{inquiries.slice(0,6).map(item=><div key={item.id} className="flex justify-between gap-3 py-2 border-b border-[#F0EAD0]"><div><b>{item.name}</b><div className="text-[12px] text-[var(--muted)]">{item.service} · {item.city}</div></div><span className="chip" style={statusColor(item.status)}>{item.status}</span></div>)}</div></div>}
                </div>
              </div>}

              {/* Owner sees all requests */}
              <div className="card mt-4 overflow-hidden border-2 !border-[#C9A227]">
                <div className="p-4 sm:p-5 bg-black text-white flex flex-wrap justify-between gap-3 items-center"><div><h3 className="font-display text-[22px]">{T(lang,'Requests & Inquiries — the owner sees them','الطلبات والاستفسارات — يراها صاحب المنشأة')}</h3><p className="text-[13px] text-[#E8D48A] mt-1">{T(lang,'All requests in one place — status, budget from SAR 100,000, and assign to reception / marketing.','كل الطلبات في مكان واحد — الحالة والميزانية من 100,000 ريال، والتعيين للاستقبال / التسويق.')}</p></div><button onClick={()=>setActive('inquiries')} className="btn-gold text-sm flex items-center gap-1"><Eye size={16}/>{T(lang,'View All Requests','عرض كل الطلبات')}</button></div>
                <div className="p-4 sm:p-5">
                  <div className="grid sm:grid-cols-3 gap-3">{[[T(lang,'Total requests','إجمالي الطلبات'),String(inquiries.length)],[T(lang,'New','جديد'),String(inquiries.filter(i=>i.status==='New').length)],[T(lang,'Budget from','الميزانية من'),fmt(100000)]].map(([l,v]:any)=><div key={l} className="border border-[var(--line)] rounded-2xl p-3"><div className="text-[11px] font-bold text-[var(--muted)]">{l}</div><div className="text-[20px] font-black mt-1">{v}</div></div>)}</div>
                  <div className="mt-4 space-y-2">{inquiries.slice(0,4).map(x=><div key={x.id} className="flex justify-between gap-3 items-center border border-[var(--line)] rounded-xl p-3 text-sm flex-wrap"><span><b>{x.name}</b> <span className="text-[var(--muted)]">· {x.service} · {x.city} · {fmt(x.budget)}</span> <span className="chip ms-1" style={statusColor(x.status)}>{x.status}</span></span><span className="flex gap-1.5 flex-wrap"><button onClick={()=>setToast(T(lang,`Assigned ${x.name} to Reception.` ,`تم تعيين ${x.name} للاستقبال.`))} className="btn-line !py-1.5 !px-2.5 text-[12px] flex items-center gap-1"><UserCheck size={13}/>{T(lang,'Assign to Reception','تعيين للاستقبال')}</button><button onClick={()=>setToast(T(lang,`Assigned ${x.name} to Marketing.` ,`تم تعيين ${x.name} للتسويق.`))} className="btn-line !py-1.5 !px-2.5 text-[12px] flex items-center gap-1"><Megaphone size={13}/>{T(lang,'Assign to Marketing','تعيين للتسويق')}</button><button onClick={()=>setSelectedInquiry(x)} className="btn-line !py-1.5 !px-2.5 text-[12px] flex items-center gap-1"><Eye size={13}/>{T(lang,'View','عرض')}</button></span></div>)}</div>
                  <p className="text-[12px] text-[var(--muted)] mt-3">{T(lang,'The owner sees every request. Each manager sees only their own dashboard.','صاحب المنشأة يشوف كل ده، كل مدير يشوف لوحته بس.')}</p>
                </div>
              </div>
            </section>}

            {showSection('inquiries') && <section className="card mt-4 overflow-hidden">
              <div className="p-4 sm:p-5 flex flex-wrap gap-3 items-center justify-between"><div><h2 className="font-display text-[22px]">{T(lang,'Latest Inquiries','أحدث الاستفسارات')}</h2><p className="text-[12px] text-[var(--muted)]">{T(lang,'New leads from the website, WhatsApp and showroom.','عملاء جدد من الموقع وواتساب والمعرض.')}</p></div><div className="flex flex-wrap gap-2"><div className="relative"><Search className="absolute top-2.5 start-3 text-[#9A8B4F]" size={16}/><input value={inqSearch} onChange={e=>setInqSearch(e.target.value)} placeholder={T(lang,'Search inquiries…','ابحث في الاستفسارات…')} className="input !ps-9 !py-2 !w-[200px]"/></div><select value={inqFilter} onChange={e=>setInqFilter(e.target.value)} className="input !w-auto !py-2"><option>All</option><option>New</option><option>Contacted</option><option>Quoted</option><option>Won</option><option>Lost</option></select><button onClick={()=>openAdd('inquiry')} className="btn-gold !py-2.5 text-sm flex items-center gap-1"><Plus size={16}/>{T(lang,'Add Inquiry','إضافة استفسار')}</button></div></div>
              <div className="overflow-x-auto scroll-thin"><table className="w-full min-w-[980px] text-sm"><thead><tr className="bg-[#FBF6DF]"><th>{T(lang,'Name','الاسم')}</th><th>{T(lang,'Phone','الهاتف')}</th><th>{T(lang,'Service','الخدمة')}</th><th>{T(lang,'City','المدينة')}</th><th>{T(lang,'Budget','الميزانية')}</th><th>{T(lang,'Status','الحالة')}</th><th>{T(lang,'Actions','إجراءات')}</th></tr></thead><tbody>
                {filteredInq.map(x=><tr key={x.id}><td className="font-bold">{x.name}</td><td className="text-[var(--muted)] whitespace-nowrap" dir="ltr">{x.phone}</td><td>{x.service}</td><td>{x.city}</td><td className="font-bold whitespace-nowrap">{fmt(x.budget)}</td><td><span className="chip" style={statusColor(x.status)}>{x.status}</span></td><td><div className="flex gap-1.5 whitespace-nowrap flex-wrap"><button onClick={()=>setToast(T(lang,`Assigned ${x.name} to Sales.` ,`تم تعيين ${x.name} للمبيعات.`))} className="btn-line !py-1.5 !px-2.5 text-[12px] flex items-center gap-1"><UserCheck size={14}/>{T(lang,'Assign','تعيين')}</button><button onClick={()=>setToast(T(lang,`Assigned ${x.name} to Reception.` ,`تم تعيين ${x.name} للاستقبال.`))} className="btn-line !py-1.5 !px-2.5 text-[12px] flex items-center gap-1"><Inbox size={14}/>{T(lang,'Reception','استقبال')}</button><button onClick={()=>setToast(T(lang,`Assigned ${x.name} to Marketing.` ,`تم تعيين ${x.name} للتسويق.`))} className="btn-line !py-1.5 !px-2.5 text-[12px] flex items-center gap-1"><Megaphone size={14}/>{T(lang,'Marketing','تسويق')}</button><button onClick={()=>setToast(T(lang,'WhatsApp chat prepared — open WhatsApp to send.','تم تجهيز محادثة واتساب — افتح واتساب للإرسال.'))} className="btn-line !py-1.5 !px-2.5 text-[12px] flex items-center gap-1"><Phone size={14}/>WhatsApp</button><button onClick={()=>setSelectedInquiry(x)} className="btn-line !py-1.5 !px-2.5 text-[12px] flex items-center gap-1"><Eye size={14}/>{T(lang,'View','عرض')}</button><button onClick={()=>openEdit('inquiry',x)} className="btn-line !py-1.5 !px-2.5 text-[12px]">{editBtn()}</button><button onClick={()=>requestDelete('inquiry',x.id,x.name,'inquiries')} className="btn-line !py-1.5 !px-2.5 text-[12px] !text-[#B42318]">{delBtn()}</button></div></td></tr>)}
                {filteredInq.length===0 && <tr><td colSpan={7} className="text-center py-8 text-[var(--muted)]">{T(lang,'No inquiries match your search / filter.','لا توجد استفسارات مطابقة لبحثك / مرشحك.')}</td></tr>}
              </tbody></table></div>
              <div className="px-4 py-3 bg-[#FBF6DF] text-[12px] text-[var(--muted)]">{T(lang,'Budget starts from SAR 100,000. Use search above to filter every table.','تبدأ الميزانيات من 100,000 ريال. استخدم البحث أعلاه لتصفية كل الجداول.')}</div>
            </section>}

            {showSection('projects') && <section className="mt-4">
              <div className="card overflow-hidden">
                <div className="p-4 sm:p-5 flex flex-wrap gap-3 justify-between items-center"><div><h2 className="font-display text-[22px]">{T(lang,'Projects','المشاريع')}</h2><p className="text-[12px] text-[var(--muted)]">{T(lang,'Factory to site — one live view.','من المصنع إلى الموقع — عرض مباشر واحد.')}</p></div><div className="flex flex-wrap gap-2"><div className="relative"><Search className="absolute top-2.5 start-3 text-[#9A8B4F]" size={16}/><input value={projSearch} onChange={e=>setProjSearch(e.target.value)} placeholder={T(lang,'Search projects…','ابحث في المشاريع…')} className="input !ps-9 !py-2 !w-[200px]"/></div><select value={projFilter} onChange={e=>setProjFilter(e.target.value)} className="input !w-auto !py-2"><option>All</option><option>In Factory</option><option>On Site</option><option>Delivered</option><option>Delayed</option></select><button onClick={()=>openAdd('project')} className="btn-gold !py-2.5 text-sm flex items-center gap-1"><Plus size={16}/>{T(lang,'Add Project','إضافة مشروع')}</button></div></div>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 p-4 sm:p-5 pt-0">
                  {filteredProj.map(x=><article key={x.id} className="border border-[var(--line)] rounded-2xl p-4"><div className="flex justify-between gap-2"><div><h3 className="font-extrabold leading-6">{x.name}</h3><p className="text-[12px] text-[var(--muted)] mt-1">{x.client} · {x.type}</p></div><span className="chip h-fit" style={statusColor(x.status)}>{x.status}</span></div><div className="flex items-center gap-2 mt-3"><div className="h-2 flex-1 bg-[#F0EAD0] rounded-full overflow-hidden"><div className="h-full bg-[#C9A227]" style={{width:`${x.progress}%`}}/></div><b className="text-[12px]">{x.progress}%</b></div><div className="flex justify-between text-[12px] text-[var(--muted)] mt-2"><span>{x.manager}</span><span>{x.deadline}</span></div><div className="flex justify-between items-center mt-3"><b>{fmt(x.budget)}</b><div className="flex gap-1.5"><button onClick={()=>openEdit('project',x)} className="btn-line !py-1.5 !px-2.5 text-[12px]">{editBtn()}</button><button onClick={()=>requestDelete('project',x.id,x.name,'projects')} className="btn-line !py-1.5 !px-2.5 text-[12px] !text-[#B42318]">{delBtn()}</button></div></div></article>)}
                  {filteredProj.length===0 && <p className="text-center py-6 text-[var(--muted)] col-span-full">{T(lang,'No projects match your search / filter.','لا توجد مشاريع مطابقة لبحثك / مرشحك.')}</p>}
                </div>
                <div className="overflow-x-auto scroll-thin"><table className="w-full min-w-[1020px] text-sm"><thead><tr className="bg-[#FBF6DF]"><th>{T(lang,'Project','المشروع')}</th><th>{T(lang,'Client','العميل')}</th><th>{T(lang,'Type','النوع')}</th><th>{T(lang,'Progress','التقدم')}</th><th>{T(lang,'Manager','المدير')}</th><th>{T(lang,'Status','الحالة')}</th><th>{T(lang,'Budget','الميزانية')}</th><th>{T(lang,'Deadline','الموعد')}</th><th>{T(lang,'Actions','إجراءات')}</th></tr></thead><tbody>
                  {filteredProj.map(x=><tr key={x.id}><td className="font-bold">{x.name}</td><td>{x.client}</td><td>{x.type}</td><td className="min-w-[150px]"><div className="flex items-center gap-2"><div className="h-2 flex-1 bg-[#F0EAD0] rounded-full overflow-hidden"><div className="h-full bg-[#C9A227]" style={{width:`${x.progress}%`}}/></div><b className="text-[12px]">{x.progress}%</b></div></td><td>{x.manager}</td><td><span className="chip" style={statusColor(x.status)}>{x.status}</span></td><td className="font-bold whitespace-nowrap">{fmt(x.budget)}</td><td className="whitespace-nowrap">{x.deadline}</td><td><div className="flex gap-1.5 whitespace-nowrap"><button onClick={()=>openEdit('project',x)} className="btn-line !py-1.5 !px-2.5 text-[12px]">{editBtn()}</button><button onClick={()=>requestDelete('project',x.id,x.name,'projects')} className="btn-line !py-1.5 !px-2.5 text-[12px] !text-[#B42318]">{delBtn()}</button></div></td></tr>)}
                </tbody></table></div>
              </div>
            </section>}

            {showSection('finance') && <section className="mt-4 grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 card p-4 sm:p-5"><h2 className="font-display text-[22px]">{T(lang,'Accounts Summary','ملخص الحسابات')}</h2><div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">{[[T(lang,'Income','الدخل'),fmt(totalIncome),'text-[#177245]'],[T(lang,'Expenses','المصاريف'),fmt(totalExpenses),'text-[#B42318]'],[T(lang,'Profit','الربح'),fmt(profit),'text-[#111]']].map(([l,v,c]:any)=><div key={l} className="border border-[var(--line)] rounded-2xl p-3"><div className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wide">{l}</div><div className={`text-[clamp(13px,3.5vw,22px)] font-black mt-1 leading-tight break-words ${c}`} style={{overflowWrap:'anywhere'}}>{v}</div></div>)}</div>
                <div className="mt-5"><div className="flex flex-wrap justify-between items-center gap-2 mb-2"><h3 className="font-extrabold">{T(lang,'Recent expenses','المصاريف الأخيرة')}</h3><div className="flex gap-2"><div className="relative"><Search className="absolute top-2.5 start-3 text-[#9A8B4F]" size={15}/><input value={expenseSearch} onChange={e=>setExpenseSearch(e.target.value)} placeholder={T(lang,'Search expenses…','ابحث في المصاريف…')} className="input !ps-8 !py-1.5 !w-[180px] text-[13px]"/></div><button onClick={()=>openAdd('expense')} className="btn-line !py-1.5 text-[12px] flex items-center gap-1"><Plus size={14}/>{T(lang,'Add Expense','إضافة مصروف')}</button></div></div>{filteredExpenses.map(e=><div key={e.id} className="flex justify-between gap-3 py-2.5 border-b border-[#F0EAD0] text-sm flex-wrap"><span>{e.label}<span className="block text-[11px] text-[var(--muted)]">{e.category}</span></span><span className="flex items-center gap-2"><b className="whitespace-nowrap">{fmt(e.amount)}</b><button onClick={()=>openEdit('expense',e)} className="btn-line !py-1 !px-2 text-[11px]">{editBtn()}</button><button onClick={()=>requestDelete('expense',e.id,e.label,'expenses')} className="btn-line !py-1 !px-2 text-[11px] !text-[#B42318]">{delBtn()}</button></span></div>)}
                {filteredExpenses.length===0 && <p className="text-sm text-[var(--muted)] py-3">{T(lang,'No expenses match your search.','لا توجد مصاريف مطابقة لبحثك.')}</p>}</div>
              </div>
              <div className="card p-4 sm:p-5"><div className="flex justify-between items-start gap-2"><div><h3 className="font-display text-[20px]">{T(lang,'Pending Invoices','الفواتير المعلقة')}</h3><p className="text-[12px] text-[var(--muted)] mt-1">{T(lang,'Total pending','إجمالي المعلق')}: <b className="text-[var(--ink)]">{fmt(385000)}</b></p></div><button onClick={()=>openAdd('invoice')} className="btn-gold !py-2 !px-3 text-[12px] flex items-center gap-1"><Plus size={14}/>{T(lang,'Add Invoice','إضافة فاتورة')}</button></div>
                <div className="relative mt-3"><Search className="absolute top-2.5 start-3 text-[#9A8B4F]" size={15}/><input value={invSearch} onChange={e=>setInvSearch(e.target.value)} placeholder={T(lang,'Search invoices…','ابحث في الفواتير…')} className="input !ps-8 !py-2 text-[13px]"/></div>
                <select value={invFilter} onChange={e=>setInvFilter(e.target.value)} className="input !py-2 mt-2 text-[13px]"><option>All</option><option>Pending</option><option>Paid</option></select>
                <div className="mt-4 space-y-3">{filteredInv.map(inv=><div key={inv.id} className="border border-[var(--line)] rounded-2xl p-3"><div className="flex justify-between gap-2"><b className="text-sm">{inv.id}</b><span className="chip" style={statusColor(inv.status)}>{inv.status}</span></div><p className="text-[13px] mt-1">{inv.client}</p><p className="text-[12px] text-[var(--muted)]">{inv.project} · {T(lang,'Due','الاستحقاق')} {inv.due}</p><div className="flex justify-between items-center mt-2 flex-wrap gap-2"><b>{fmt(inv.amount)}</b><div className="flex gap-1.5 flex-wrap"><button onClick={()=>remind(inv)} className="btn-line !py-1.5 !px-2.5 text-[12px] flex items-center gap-1"><BellRing size={13}/>{T(lang,'Remind','تذكير')}</button>{inv.status!=='Paid' && <button onClick={()=>markPaid(inv)} className="btn-gold !py-1.5 !px-3 text-[12px] flex items-center gap-1"><CreditCard size={13}/>{T(lang,'Pay','دفع')}</button>}<button onClick={()=>openEdit('invoice',inv)} className="btn-line !py-1.5 !px-2.5 text-[12px]">{editBtn()}</button><button onClick={()=>requestDelete('invoice',inv.id,inv.id,'invoices')} className="btn-line !py-1.5 !px-2.5 text-[12px] !text-[#B42318]">{delBtn()}</button></div></div></div>)}
                {filteredInv.length===0 && <p className="text-sm text-[var(--muted)] py-3">{T(lang,'No invoices match your search / filter.','لا توجد فواتير مطابقة لبحثك / مرشحك.')}</p>}</div></div>
            </section>}

            {showSection('warehouse') && <section className="card mt-4 overflow-hidden">
              <div className="p-4 sm:p-5 flex flex-wrap justify-between gap-3 items-center"><div><h2 className="font-display text-[22px]">{T(lang,'Warehouse / Inventory','المستودع / المخزون')}</h2><p className="text-[12px] text-[var(--muted)]">{T(lang,'Al-Rass central warehouse','مستودع الرس المركزي')}</p></div><div className="flex flex-wrap gap-2"><div className="relative"><Search className="absolute top-2.5 start-3 text-[#9A8B4F]" size={16}/><input value={stockSearch} onChange={e=>setStockSearch(e.target.value)} placeholder={T(lang,'Search stock…','ابحث في المخزون…')} className="input !ps-9 !py-2 !w-[200px]"/></div><select value={stockFilter} onChange={e=>setStockFilter(e.target.value)} className="input !w-auto !py-2"><option>All</option><option>Low</option><option>OK</option><option>Moulds</option><option>Steel</option><option>Cement</option><option>Panels</option></select><button onClick={()=>openAdd('stock')} className="btn-gold !py-2.5 text-sm flex items-center gap-1"><Plus size={16}/>{T(lang,'Add Stock','إضافة مخزون')}</button></div></div>
              <div className="px-4 sm:px-5 pb-3 flex flex-wrap gap-2">{stock.filter(s=>s.status==='Low').map(s=><span key={s.id} className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#92400E] text-[12px] font-bold px-3 py-1.5 rounded-full"><AlertTriangle size={14}/>{T(lang,'Low stock:','مخزون منخفض:')} {s.item} — {s.qty} {s.unit}</span>)}</div>
              <div className="overflow-x-auto scroll-thin"><table className="w-full min-w-[860px] text-sm"><thead><tr className="bg-[#FBF6DF]"><th>{T(lang,'Item','الصنف')}</th><th>{T(lang,'Category','الفئة')}</th><th>{T(lang,'Quantity','الكمية')}</th><th>{T(lang,'Minimum','الحد الأدنى')}</th><th>{T(lang,'Status','الحالة')}</th><th>{T(lang,'Action','إجراء')}</th></tr></thead><tbody>{filteredStock.map(s=><tr key={s.id}><td className="font-bold">{s.item}</td><td>{s.category}</td><td>{s.qty.toLocaleString()} {s.unit}</td><td>{s.min} {s.unit}</td><td><span className="chip" style={s.status==='Low'?{background:'#FEF3C7',color:'#92400E'}:{background:'#D1FAE5',color:'#065F46'}}>{s.status}</span></td><td><div className="flex gap-1.5 flex-wrap"><button onClick={()=>reorder(s)} className="btn-line !py-1.5 !px-3 text-[12px] flex items-center gap-1"><Package size={14}/>{T(lang,'Reorder','إعادة طلب')}</button><button onClick={()=>openEdit('stock',s)} className="btn-line !py-1.5 !px-3 text-[12px]">{editBtn()}</button><button onClick={()=>requestDelete('stock',s.id,s.item,'inventory')} className="btn-line !py-1.5 !px-3 text-[12px] !text-[#B42318]">{delBtn()}</button></div></td></tr>)}{filteredStock.length===0 && <tr><td colSpan={6} className="text-center py-8 text-[var(--muted)]">{T(lang,'No stock matches your search / filter.','لا يوجد مخزون مطابق لبحثك / مرشحك.')}</td></tr>}</tbody></table></div>
            </section>}

            {showSection('marketing') && <section className="mt-4 grid lg:grid-cols-5 gap-4">
              <div className="card p-4 sm:p-5 lg:col-span-3"><h2 className="font-display text-[22px]">{T(lang,'Marketing / Follow-up','التسويق / المتابعة')}</h2><p className="text-[12px] text-[var(--muted)] mt-1">{T(lang,'Leads funnel — this month','قمع العملاء المحتملين — هذا الشهر')}</p>
                <div className="mt-5 space-y-3">{[[T(lang,'New','جديد'),32,'100%','#111'],[T(lang,'Contacted','تم التواصل'),21,'78%','#C9A227'],[T(lang,'Quoted','تم التسعير'),12,'56%','#D9B64A'],[T(lang,'Won','تم الفوز'),5,'34%','#E8D48A']].map(([l,v,w,c]:any)=><div key={l} className="flex items-center gap-3"><span className="w-[90px] text-[13px] font-bold">{l}</span><div className="flex-1 h-9 bg-[#FAF8F0] rounded-xl overflow-hidden"><div className="h-full rounded-xl grid place-items-center text-[13px] font-black text-white" style={{width:w,background:c}}>{v}</div></div></div>)}</div>
                <p className="text-[12px] text-[var(--muted)] mt-4">{T(lang,'Conversion New → Won: 15.6%','معدل التحويل من جديد إلى فوز: 15.6%')}</p>
                <div className="mt-5 border-t border-[var(--line)] pt-4"><div className="flex justify-between items-center gap-2 flex-wrap"><h3 className="font-extrabold">{T(lang,'Leads','العملاء المحتملون')}</h3><button onClick={()=>openAdd('inquiry')} className="btn-line !py-1.5 text-[12px] flex items-center gap-1"><Plus size={14}/>{T(lang,'Add Inquiry','إضافة استفسار')}</button></div><div className="mt-3 space-y-2">{filteredInq.slice(0,4).map(x=><div key={x.id} className="flex justify-between gap-2 items-center border border-[var(--line)] rounded-xl p-3 text-sm flex-wrap"><span><b>{x.name}</b> <span className="text-[var(--muted)]">· {x.service} · {x.city}</span></span><span className="flex gap-1.5"><button onClick={()=>openEdit('inquiry',x)} className="btn-line !py-1 !px-2 text-[11px]">{editBtn()}</button><button onClick={()=>requestDelete('inquiry',x.id,x.name,'inquiries')} className="btn-line !py-1 !px-2 text-[11px] !text-[#B42318]">{delBtn()}</button></span></div>)}</div></div>
              </div>
              <div className="card p-4 sm:p-5 lg:col-span-2"><div className="flex justify-between items-center gap-2"><h3 className="font-display text-[20px]">{T(lang,'Follow-up · Today','متابعة · اليوم')}</h3><button onClick={()=>openAdd('task')} className="btn-gold !py-2 !px-3 text-[12px] flex items-center gap-1"><Plus size={14}/>{T(lang,'Add Task','إضافة مهمة')}</button></div><div className="relative mt-3"><Search className="absolute top-2.5 start-3 text-[#9A8B4F]" size={15}/><input value={taskSearch} onChange={e=>setTaskSearch(e.target.value)} placeholder={T(lang,'Search tasks…','ابحث في المهام…')} className="input !ps-8 !py-2 text-[13px]"/></div><div className="mt-3 space-y-2">{filteredTasks.map(t=><div key={t.id} className="flex gap-2 items-start border border-[var(--line)] rounded-xl p-3"><input type="checkbox" checked={t.done} onChange={()=>toggleTask(t)} className="w-5 h-5 accent-[#C9A227] mt-0.5 flex-none"/><label className={`flex-1 ${t.done?'line-through text-[var(--muted)] text-sm':'text-sm font-semibold'}`}>{t.text}</label><span className="text-[12px] text-[var(--muted)] whitespace-nowrap">{t.time}</span><div className="flex gap-1 flex-none"><button onClick={()=>openEdit('task',t)} className="btn-line !py-1 !px-2 text-[11px]">{editBtn()}</button><button onClick={()=>requestDelete('task',t.id,t.text,'followup_tasks')} className="btn-line !py-1 !px-2 text-[11px] !text-[#B42318]">{delBtn()}</button></div></div>)}
              {filteredTasks.length===0 && <p className="text-sm text-[var(--muted)] py-3">{T(lang,'No tasks match your search.','لا توجد مهام مطابقة لبحثك.')}</p>}</div><p className="text-[12px] text-[var(--muted)] mt-3">{T(lang,'Tick a task to mark it complete. It is saved to the app database.','ضع علامة على المهمة لتحديدها كمكتملة. يتم حفظها في قاعدة بيانات التطبيق.')}</p></div>
            </section>}

            {showSection('team') && <section className="mt-4">
              <div className="flex flex-wrap justify-between gap-3 items-end"><div><p className="text-[12px] font-extrabold tracking-[0.18em] text-[#9A6A00]">★ {T(lang,'MOST IMPORTANT','الأهم')}</p><h2 className="font-display text-[clamp(24px,3vw,34px)] mt-1">{T(lang,'Team & Permissions','الفريق والصلاحيات')}</h2><p className="text-[var(--muted)] text-sm mt-1 max-w-[720px]">{T(lang,'Owner sees everything, others see only what owner allows. Turn a toggle off to hide that area from the role instantly.','المالك يرى كل شيء، والآخرون يرون فقط ما يسمح به المالك. أوقف زر التبديل لإخفاء ذلك القسم عن الدور فوراً.')}</p></div><div className="flex gap-2 flex-wrap"><button onClick={()=>openAdd('role')} className="btn-line flex items-center gap-1.5 text-sm"><Plus size={16}/>{T(lang,'Add Role','إضافة دور')}</button><button onClick={()=>openAdd('member')} className="btn-gold flex items-center gap-1.5 text-sm"><Plus size={17}/>{T(lang,'Add Member','إضافة عضو')}</button></div></div>

              <div className="card mt-4 overflow-hidden"><div className="p-4 bg-black text-white flex flex-wrap justify-between gap-2"><div className="flex gap-2 items-center"><ShieldCheck className="text-[#E8D48A]"/><b className="text-sm sm:text-[15px]">{T(lang,'Permission matrix — controlled by the owner','مصفوفة الصلاحيات — يتحكم بها المالك')}</b></div><span className="text-[12px] text-[#E8D48A]">{T(lang,'Owner: Sabry — full access','المالك: صبري — وصول كامل')}</span></div>
                <div className="overflow-x-auto scroll-thin"><table className="w-full min-w-[1120px] text-sm"><thead><tr className="bg-[#FBF6DF]"><th className="!ps-5">{T(lang,'Role','الدور')}</th>{PERMS.map(p=><th key={p.key} className="text-center min-w-[118px]">{lang==='en'?p.en:p.ar}</th>)}<th>{T(lang,'Actions','إجراءات')}</th></tr></thead><tbody>
                  {roles.map(role=><tr key={role}><td className="!ps-5"><b>{roleLabel(lang,role)}</b><span className="block text-[11px] text-[var(--muted)]">{members.find(m=>m.role===role)?.name||''}</span></td>{PERMS.map(p=><td key={p.key} className="text-center"><button aria-label={`${role} ${p.key}`} onClick={()=>togglePerm(role,p.key)} className={`toggle ${perms[role]?.[p.key]?'on':''}`}/></td>)}<td><div className="flex gap-1.5 whitespace-nowrap"><button onClick={()=>openRoleEdit(role)} className="btn-line !py-1.5 !px-2.5 text-[12px]">{editBtn()}</button><button onClick={()=>requestDelete('role',role,roleLabel(lang,role))} className="btn-line !py-1.5 !px-2.5 text-[12px] !text-[#B42318]">{delBtn()}</button></div></td></tr>)}
                </tbody></table></div>
                <div className="px-4 py-3 bg-[#FBF6DF] text-[12px] flex gap-2"><CheckCircle2 size={16} className="text-[#177245] flex-none"/>{T(lang,'Owner sees everything, others see only what owner allows. Changes are saved when the records service is available.','المالك يرى كل شيء، والآخرون يرون فقط ما يسمح به المالك. يتم حفظ التغييرات عند توفر خدمة السجلات.')}</div>
              </div>

              <div className="card mt-4 overflow-hidden"><div className="p-4 sm:p-5 flex flex-wrap justify-between gap-3 items-center"><h3 className="font-display text-[20px]">{T(lang,'Team members','أعضاء الفريق')}</h3><div className="flex gap-2 flex-wrap"><div className="relative"><Search className="absolute top-2.5 start-3 text-[#9A8B4F]" size={15}/><input value={teamSearch} onChange={e=>setTeamSearch(e.target.value)} placeholder={T(lang,'Search team…','ابحث في الفريق…')} className="input !ps-8 !py-2 !w-[190px] text-[13px]"/></div><button onClick={()=>openAdd('member')} className="btn-gold !py-2 !px-3 text-[12px] flex items-center gap-1"><Plus size={14}/>{T(lang,'Add Member','إضافة عضو')}</button></div></div><div className="overflow-x-auto scroll-thin"><table className="w-full min-w-[980px] text-sm"><thead><tr className="bg-[#FBF6DF]"><th>{T(lang,'Name','الاسم')}</th><th>{T(lang,'Role','الدور')}</th><th>{T(lang,'Email','البريد الإلكتروني')}</th><th>{T(lang,'Phone','الهاتف')}</th><th>{T(lang,'Password','كلمة المرور')}</th><th>{T(lang,'Access','الوصول')}</th><th>{T(lang,'Actions','إجراءات')}</th></tr></thead><tbody>{filteredMembers.map(m=><tr key={m.id}><td className="font-bold flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-[#FBF6DF] grid place-items-center text-[12px] font-black text-[#8A6D0A]">{m.name[0]}</span>{m.name}</td><td>{roleLabel(lang,m.role)}</td><td className="text-[var(--muted)] break-all">{m.email || '—'}</td><td dir="ltr">{m.phone}</td><td>••••••</td><td><span className="chip bg-[#FBF6DF] text-[#8A6D0A]">{Object.values(perms[m.role]||{}).filter(Boolean).length} / 7 {T(lang,'allowed','مسموح')}</span></td><td><div className="flex gap-1.5 whitespace-nowrap"><button onClick={()=>openEdit('member',m)} className="btn-line !py-1.5 !px-2.5 text-[12px]">{editBtn()}</button><button onClick={()=>requestDelete('member',m.id,m.name,'team_members')} className="btn-line !py-1.5 !px-2.5 text-[12px] !text-[#B42318]">{delBtn()}</button></div></td></tr>)}
              {filteredMembers.length===0 && <tr><td colSpan={7} className="text-center py-8 text-[var(--muted)]">{T(lang,'No members match your search.','لا يوجد أعضاء مطابقون لبحثك.')}</td></tr>}</tbody></table></div></div>
            </section>}

            {showSection('reports') && <section className="card mt-4 p-4 sm:p-5"><h2 className="font-display text-[22px]">{T(lang,'Reports','التقارير')}</h2><p className="text-sm text-[var(--muted)] mt-1">{T(lang,'A snapshot for the owner — no extra exports needed here.','لمحة سريعة للمالك — لا حاجة إلى تصديرات إضافية هنا.')}</p><div className="grid sm:grid-cols-3 gap-3 mt-4">{[[T(lang,'Win rate','معدل الفوز'),'15.6%'],[T(lang,'Average project budget','متوسط ميزانية المشروع'),fmt(811000)],[T(lang,'On-time delivery','التسليم في الوقت المحدد'),'91%']].map(([l,v]:any)=><div key={l} className="border border-[var(--line)] rounded-2xl p-4"><div className="text-[12px] font-bold text-[var(--muted)]">{l}</div><div className="text-[22px] font-black mt-1">{v}</div></div>)}</div><div className="mt-4 bg-[#FBF6DF] rounded-2xl p-4 text-sm leading-7">{T(lang,'Top insight: Prefab villas and GFRC facades drive most revenue. Container offices close fastest. Follow up quoted leads within 24 hours to lift the win rate.','أهم ملاحظة: الفلل مسبقة الصنع وواجهات GFRC تحقق معظم الإيرادات. مكاتب الحاويات تُغلق أسرع. تابع العملاء المسعّرين خلال 24 ساعة لرفع معدل الفوز.')}</div></section>}

            {showSection('settings') && <section className="card mt-4 p-4 sm:p-5 max-w-[720px]"><h2 className="font-display text-[22px]">{T(lang,'Settings','الإعدادات')}</h2><div className="mt-4 space-y-3"><label className="block"><span className="text-sm font-bold">{T(lang,'Language','اللغة')}</span><div className="flex gap-2 mt-2"><button onClick={()=>setLang('en')} className={`btn-line flex-1 ${lang==='en'?'!border-[#C9A227] bg-[#FBF6DF]':''}`}>English</button><button onClick={()=>setLang('ar')} className={`btn-line flex-1 ${lang==='ar'?'!border-[#C9A227] bg-[#FBF6DF]':''}`}>العربية</button></div></label><label className="block"><span className="text-sm font-bold">{T(lang,'Branch','الفرع')}</span><select value={branch} onChange={e=>setBranch(e.target.value)} className="input mt-2"><option>Al-Rass — Head Office</option><option>Al-Qassim — One Branch</option></select></label><label className="block"><span className="text-sm font-bold">{T(lang,'Owner','المالك')}</span><input defaultValue="Sabry — Owner" className="input mt-2"/></label><p className="text-[12px] text-[var(--muted)]">{T(lang,'Brand: white background, gold #C9A227, black text. Currency is always SAR.','الهوية: خلفية بيضاء، ذهبي #C9A227، نص أسود. العملة دائماً ريال سعودي.')}</p></div></section>}

            <footer className="mt-8 pb-4">
              <div className="gold-line mb-3"/>
              <div className="flex justify-center gap-2.5 mb-3">
                {socialLinks.map(({label,href,icon:Icon}) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="btn-line !rounded-full !p-2.5 flex items-center justify-center text-[var(--ink)] hover:text-[#C9A227]" title={label}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
              <p className="text-center text-[12px] text-[var(--muted)] font-bold">ALKADER ALMOHTARIF · Al-Rass · {T(lang,'Owner Dashboard','لوحة تحكم المالك')} · {T(lang,'All amounts in SAR','جميع المبالغ بالريال السعودي')}</p>
            </footer>
          </main>
        </div>
      </div>

      {selectedInquiry && <div className="fixed inset-0 z-50 grid place-items-center p-4"><div className="absolute inset-0 bg-black/50" onClick={()=>setSelectedInquiry(null)}/><div className="relative card w-full max-w-[480px] p-5 bg-white"><button onClick={()=>setSelectedInquiry(null)} className="absolute top-3 end-3 btn-line !p-1.5"><X size={16}/></button><div className="w-11 h-11 rounded-full bg-[#C9A227] text-white grid place-items-center font-black text-lg">{selectedInquiry.name[0]}</div><h3 className="font-display text-[24px] mt-3">{selectedInquiry.name}</h3><p className="text-sm text-[var(--muted)]">{selectedInquiry.service} · {selectedInquiry.city}</p><div className="grid grid-cols-2 gap-3 mt-4 text-sm"><div className="border rounded-xl p-3"><span className="text-[11px] text-[var(--muted)] font-bold">{T(lang,'PHONE','الهاتف')}</span><div dir="ltr" className="font-bold mt-1">{selectedInquiry.phone}</div></div><div className="border rounded-xl p-3"><span className="text-[11px] text-[var(--muted)] font-bold">{T(lang,'BUDGET','الميزانية')}</span><div className="font-bold mt-1">{fmt(selectedInquiry.budget)}</div></div></div><p className="text-sm mt-3"><span className="chip" style={statusColor(selectedInquiry.status)}>{selectedInquiry.status}</span></p><div className="flex gap-2 mt-4"><button onClick={()=>{setSelectedInquiry(null); setToast(T(lang,'WhatsApp chat prepared.','تم تجهيز محادثة واتساب.'))}} className="btn-gold flex-1">{T(lang,'Open WhatsApp Follow-up','فتح متابعة واتساب')}</button><button onClick={()=>{const it=selectedInquiry; setSelectedInquiry(null); openEdit('inquiry',it);}} className="btn-line flex-1">{editBtn()}</button></div></div></div>}

      {deleteTarget && <div className="fixed inset-0 z-50 grid place-items-center p-4"><div className="absolute inset-0 bg-black/50" onClick={()=>setDeleteTarget(null)}/><div className="relative card w-full max-w-[440px] p-5 bg-white"><div className="w-11 h-11 rounded-full bg-[#FEE2E2] text-[#B42318] grid place-items-center"><Trash2 size={20}/></div><h3 className="font-display text-[22px] mt-3">{T(lang,'Delete this item?','حذف هذا العنصر؟')}</h3><p className="text-sm text-[var(--muted)] mt-2 leading-6">{T(lang,'This will permanently remove','سيتم حذف') } <b className="text-[var(--ink)]">{deleteTarget.label}</b> {T(lang,'from the list. This action cannot be undone.','من القائمة نهائياً. لا يمكن التراجع عن هذا الإجراء.')}</p><div className="flex gap-2 mt-5"><button onClick={()=>setDeleteTarget(null)} className="btn-line flex-1">{T(lang,'Cancel','إلغاء')}</button><button disabled={busy} onClick={confirmDelete} className="flex-1 bg-[#B42318] text-white rounded-[12px] py-[11px] px-4 font-extrabold disabled:opacity-60">{busy?T(lang,'Deleting…','جارٍ الحذف…'):T(lang,'Delete','حذف')}</button></div></div></div>}

      {modal && <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center p-0 sm:p-4"><div className="absolute inset-0 bg-black/50" onClick={()=>setModal('')}/><div className="relative card w-full max-w-[520px] bg-white p-5 max-h-[92vh] overflow-y-auto rounded-b-none sm:rounded-b-[18px]"><div className="flex justify-between items-center"><h3 className="font-display text-[22px]">{modal==='inquiry'?(editingId?T(lang,'Edit Inquiry','تعديل استفسار'):T(lang,'Add Inquiry','إضافة استفسار')):modal==='project'?(editingId?T(lang,'Edit Project','تعديل مشروع'):T(lang,'Add Project','إضافة مشروع')):modal==='expense'?(editingId?T(lang,'Edit Expense','تعديل مصروف'):T(lang,'Add Expense','إضافة مصروف')):modal==='stock'?(editingId?T(lang,'Edit Stock','تعديل مخزون'):T(lang,'Add Stock','إضافة مخزون')):modal==='member'?(editingId?T(lang,'Edit Member','تعديل عضو'):T(lang,'Add Member','إضافة عضو')):modal==='invoice'?(editingId?T(lang,'Edit Invoice','تعديل فاتورة'):T(lang,'Add Invoice','إضافة فاتورة')):modal==='task'?(editingId?T(lang,'Edit Task','تعديل مهمة'):T(lang,'Add Task','إضافة مهمة')):modal==='employee'?(editingId?T(lang,'Edit Employee','تعديل موظف'):T(lang,'Add Employee','إضافة موظف')):modal==='payroll'?(editingId?T(lang,'Edit Payroll','تعديل راتب'):T(lang,'Add Payroll','إضافة راتب')):modal==='transfer'?T(lang,'Transfer Money','تحويل أموال'):modal==='kpi'?T(lang,'Edit KPI','تعديل المؤشر'):modal==='role'?(editingRole?T(lang,'Edit Role','تعديل دور'):T(lang,'Add Role','إضافة دور')):T(lang,'Send Broadcast','إرسال رسالة جماعية')}</h3><button onClick={()=>setModal('')} className="btn-line !p-1.5"><X size={17}/></button></div>
        <div className="mt-4 space-y-3">
          {modal==='kpi' && <><label className="block text-sm font-bold">{T(lang,'Value','القيمة')}<input className="input mt-1" value={form.value||''} onChange={e=>setForm((f:any)=>({...f,value:e.target.value}))}/></label><label className="block text-sm font-bold">{T(lang,'Trend','الاتجاه')}<input className="input mt-1" value={form.trend||''} onChange={e=>setForm((f:any)=>({...f,trend:e.target.value}))}/></label><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={!!form.up} onChange={e=>setForm((f:any)=>({...f,up:e.target.checked}))} className="w-5 h-5 accent-[#C9A227]"/>{T(lang,'Positive trend','اتجاه إيجابي')}</label></>}
          {modal==='role' && <><label className="block text-sm font-bold">{T(lang,'Role name','اسم الدور')}<input className="input mt-1" value={form.name||''} onChange={e=>setForm((f:any)=>({...f,name:e.target.value}))} placeholder={T(lang,'e.g. Sales Manager','مثال: مدير مبيعات')}/></label><p className="text-[12px] text-[var(--muted)]">{T(lang,'Permissions for this role can be changed with the toggles in the matrix.','يمكن تغيير صلاحيات هذا الدور من أزرار التبديل في المصفوفة.')}</p></>}
          {modal==='employee' && <><input className="input" placeholder={T(lang,'Full name','الاسم الكامل')} value={form.name||''} onChange={e=>setForm((f:any)=>({...f,name:e.target.value}))}/><select className="input" value={form.role||'عامل'} onChange={e=>setForm((f:any)=>({...f,role:e.target.value}))}><option>مدير الحسابات</option><option>محاسب</option><option>HR / شؤون موظفين</option><option>مدير التسويق</option><option>مدير المخازن</option><option>مدير تشغيل / مشاريع</option><option>موظف استقبال الطلبات</option><option>مهندس مصنع</option><option>عامل</option></select><select className="input" value={form.dept||'العمال'} onChange={e=>setForm((f:any)=>({...f,dept:e.target.value}))}><option>المالية</option><option>التسويق</option><option>المخازن</option><option>الموارد البشرية</option><option>الاستقبال</option><option>التشغيل</option><option>المصنع</option><option>العمال</option></select><input className="input" placeholder={T(lang,'Phone','الهاتف')} value={form.phone||''} onChange={e=>setForm((f:any)=>({...f,phone:e.target.value}))}/><input className="input" type="number" placeholder={T(lang,'Monthly salary (SAR)','الراتب الشهري (ريال)')} value={form.salary||''} onChange={e=>setForm((f:any)=>({...f,salary:e.target.value}))}/><input className="input" type="date" value={form.hireDate||''} onChange={e=>setForm((f:any)=>({...f,hireDate:e.target.value}))}/><div className="grid grid-cols-2 gap-3"><select className="input" value={form.status||'نشط'} onChange={e=>setForm((f:any)=>({...f,status:e.target.value}))}><option>نشط</option><option>إجازة</option><option>موقوف</option></select><select className="input" value={form.attendance||'حاضر'} onChange={e=>setForm((f:any)=>({...f,attendance:e.target.value}))}><option>حاضر</option><option>إجازة</option><option>غائب</option></select></div></>}
          {modal==='payroll' && <><select className="input" value={form.employeeId||employees[0]?.id||''} onChange={e=>{const emp=employees.find(x=>x.id===e.target.value); setForm((f:any)=>({...f,employeeId:e.target.value,employee:emp?.name||'',base:emp?.salary||f.base}));}}>{employees.map(e=><option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}</select><input className="input" placeholder={T(lang,'Month','الشهر')} value={form.month||'يناير 2026'} onChange={e=>setForm((f:any)=>({...f,month:e.target.value}))}/><div className="grid grid-cols-2 gap-3"><input className="input" type="number" placeholder={T(lang,'Base salary','الراتب الأساسي')} value={form.base ?? form.salary ?? ''} onChange={e=>setForm((f:any)=>({...f,base:e.target.value}))}/><input className="input" type="number" placeholder={T(lang,'Extra / Deduction','إضافي / خصم')} value={form.adjustment||''} onChange={e=>setForm((f:any)=>({...f,adjustment:e.target.value}))}/></div><select className="input" value={form.status||'معلق'} onChange={e=>setForm((f:any)=>({...f,status:e.target.value}))}><option>معلق</option><option>تم الصرف</option></select><p className="text-[12px] text-[var(--muted)]">{T(lang,'Net','الصافي')}: {fmt(Number(form.base||employees.find(e=>e.id===form.employeeId)?.salary||0)+Number(form.adjustment||0))}</p></>}
          {modal==='transfer' && <><div className="bg-[#FBF6DF] rounded-xl p-3 text-sm flex justify-between gap-2 flex-wrap"><span>{T(lang,'Owner balance','رصيد المالك')}: <b>{fmt(ownerBalance)}</b></span><span>{T(lang,'Accounts balance','رصيد مدير الحسابات')}: <b>{fmt(accountsBalance)}</b></span></div><label className="block text-sm font-bold">{T(lang,'To','إلى')}<input className="input mt-1" value={form.to||'Ahmed Al-Harbi'} onChange={e=>setForm((f:any)=>({...f,to:e.target.value}))}/></label><label className="block text-sm font-bold">{T(lang,'Amount (SAR)','المبلغ (ريال)')}<input className="input mt-1" type="number" value={form.amount||''} onChange={e=>setForm((f:any)=>({...f,amount:e.target.value}))} placeholder="50000"/></label><label className="block text-sm font-bold">{T(lang,'Reason','السبب')}<select className="input mt-1" value={form.reason||'رواتب'} onChange={e=>setForm((f:any)=>({...f,reason:e.target.value}))}><option>رواتب</option><option>مصاريف مصنع</option><option>شراء خامات</option><option>سلف</option></select></label><label className="block text-sm font-bold">{T(lang,'Date','التاريخ')}<input className="input mt-1" type="date" value={form.date||''} onChange={e=>setForm((f:any)=>({...f,date:e.target.value}))}/></label><p className="text-[12px] text-[var(--muted)]">{T(lang,'Transfer deducts from the owner and adds to the accounts manager.','التحويل يخصم من المالك ويضيف لمدير الحسابات.')}</p></>}
          {modal==='inquiry' && <><input className="input" placeholder={T(lang,'Full name','الاسم الكامل')} value={form.name||''} onChange={e=>setForm((f:any)=>({...f,name:e.target.value}))}/><input className="input" placeholder={T(lang,'Phone','الهاتف')} value={form.phone||''} onChange={e=>setForm((f:any)=>({...f,phone:e.target.value}))}/><div className="grid grid-cols-2 gap-3"><select className="input" value={form.service||'Prefab'} onChange={e=>setForm((f:any)=>({...f,service:e.target.value}))}><option>Prefab</option><option>GFRC</option><option>Container</option><option>GFRG</option></select><input className="input" placeholder={T(lang,'City','المدينة')} value={form.city||'Al-Rass'} onChange={e=>setForm((f:any)=>({...f,city:e.target.value}))}/></div><select className="input" value={form.status||'New'} onChange={e=>setForm((f:any)=>({...f,status:e.target.value}))}><option>New</option><option>Contacted</option><option>Quoted</option><option>Won</option><option>Lost</option></select><label className="block text-sm font-bold">{T(lang,'Budget (from SAR 100,000)','الميزانية (من 100,000 ريال)')} — {fmt(Number(form.budget||250000))}<input type="range" min={100000} max={2000000} step={10000} value={form.budget||250000} onChange={e=>setForm((f:any)=>({...f,budget:e.target.value}))} className="w-full accent-[#C9A227] mt-2"/></label></>}
          {modal==='project' && <><input className="input" placeholder={T(lang,'Project name','اسم المشروع')} value={form.name||''} onChange={e=>setForm((f:any)=>({...f,name:e.target.value}))}/><input className="input" placeholder={T(lang,'Client','العميل')} value={form.client||''} onChange={e=>setForm((f:any)=>({...f,client:e.target.value}))}/><div className="grid grid-cols-2 gap-3"><select className="input" value={form.type||'Prefab Villa'} onChange={e=>setForm((f:any)=>({...f,type:e.target.value}))}><option>Prefab Villa</option><option>GFRC Facade</option><option>Container</option><option>GFRG Interior</option><option>Prefab Majlis</option></select><input className="input" placeholder={T(lang,'Manager','المدير')} value={form.manager||'Eng. Omar'} onChange={e=>setForm((f:any)=>({...f,manager:e.target.value}))}/></div><select className="input" value={form.status||'In Factory'} onChange={e=>setForm((f:any)=>({...f,status:e.target.value}))}><option>In Factory</option><option>On Site</option><option>Delivered</option><option>Delayed</option></select><input className="input" type="number" placeholder={T(lang,'Budget (SAR)','الميزانية (ريال)')} value={form.budget||''} onChange={e=>setForm((f:any)=>({...f,budget:e.target.value}))}/><input className="input" type="date" value={form.deadline||''} onChange={e=>setForm((f:any)=>({...f,deadline:e.target.value}))}/><label className="block text-sm font-bold">{T(lang,'Progress','التقدم')}: {form.progress||10}%<input type="range" min={0} max={100} value={form.progress||10} onChange={e=>setForm((f:any)=>({...f,progress:e.target.value}))} className="w-full accent-[#C9A227]"/></label></>}
          {modal==='expense' && <><input className="input" placeholder={T(lang,'Expense description','وصف المصروف')} value={form.label||''} onChange={e=>setForm((f:any)=>({...f,label:e.target.value}))}/><input className="input" type="number" placeholder={T(lang,'Amount (SAR)','المبلغ (ريال)')} value={form.amount||''} onChange={e=>setForm((f:any)=>({...f,amount:e.target.value}))}/><select className="input" value={form.category||'Materials'} onChange={e=>setForm((f:any)=>({...f,category:e.target.value}))}><option>Materials</option><option>Labour</option><option>Logistics</option><option>Marketing</option><option>General</option></select></>}
          {modal==='stock' && <><input className="input" placeholder={T(lang,'Item name','اسم الصنف')} value={form.item||''} onChange={e=>setForm((f:any)=>({...f,item:e.target.value}))}/><div className="grid grid-cols-2 gap-3"><input className="input" type="number" placeholder={T(lang,'Quantity','الكمية')} value={form.qty||''} onChange={e=>setForm((f:any)=>({...f,qty:e.target.value}))}/><input className="input" placeholder={T(lang,'Unit — pcs / kg / bags','الوحدة')} value={form.unit||'pcs'} onChange={e=>setForm((f:any)=>({...f,unit:e.target.value}))}/></div><input className="input" type="number" placeholder={T(lang,'Minimum level','الحد الأدنى')} value={form.min||''} onChange={e=>setForm((f:any)=>({...f,min:e.target.value}))}/><input className="input" placeholder={T(lang,'Category','الفئة')} value={form.category||''} onChange={e=>setForm((f:any)=>({...f,category:e.target.value}))}/><select className="input" value={form.status||'OK'} onChange={e=>setForm((f:any)=>({...f,status:e.target.value}))}><option>OK</option><option>Low</option></select></>}
          {modal==='member' && <><input className="input" placeholder={T(lang,'Full name','الاسم الكامل')} value={form.name||''} onChange={e=>setForm((f:any)=>({...f,name:e.target.value}))}/><select className="input" value={form.role||roles[0]} onChange={e=>setForm((f:any)=>({...f,role:e.target.value}))}>{roles.map(r=><option key={r} value={r}>{roleLabel(lang,r)}</option>)}</select><input className="input" type="email" placeholder={T(lang,'Email address','البريد الإلكتروني')} value={form.email||''} onChange={e=>setForm((f:any)=>({...f,email:e.target.value}))}/><input className="input" placeholder={T(lang,'Phone','الهاتف')} value={form.phone||''} onChange={e=>setForm((f:any)=>({...f,phone:e.target.value}))}/><input className="input" type="password" placeholder={T(lang,'Password','كلمة المرور')} onChange={e=>setForm((f:any)=>({...f,password:e.target.value}))}/><p className="text-[12px] text-[var(--muted)]">{T(lang,'The new member will only see the areas allowed for their role.','سيرى العضو الجديد فقط الأقسام المسموح بها لدوره.')}</p></>}
          {modal==='invoice' && <><input className="input" placeholder={T(lang,'Invoice number','رقم الفاتورة')} value={form.id||''} disabled={!!editingId} onChange={e=>setForm((f:any)=>({...f,id:e.target.value}))}/><input className="input" placeholder={T(lang,'Client','العميل')} value={form.client||''} onChange={e=>setForm((f:any)=>({...f,client:e.target.value}))}/><input className="input" placeholder={T(lang,'Project','المشروع')} value={form.project||''} onChange={e=>setForm((f:any)=>({...f,project:e.target.value}))}/><input className="input" type="number" placeholder={T(lang,'Amount (SAR)','المبلغ (ريال)')} value={form.amount||''} onChange={e=>setForm((f:any)=>({...f,amount:e.target.value}))}/><input className="input" type="date" value={form.due||''} onChange={e=>setForm((f:any)=>({...f,due:e.target.value}))}/><select className="input" value={form.status||'Pending'} onChange={e=>setForm((f:any)=>({...f,status:e.target.value}))}><option>Pending</option><option>Paid</option></select></>}
          {modal==='task' && <><input className="input" placeholder={T(lang,'Task','المهمة')} value={form.text||''} onChange={e=>setForm((f:any)=>({...f,text:e.target.value}))}/><input className="input" type="time" value={form.time||'09:00'} onChange={e=>setForm((f:any)=>({...f,time:e.target.value}))}/><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={!!form.done} onChange={e=>setForm((f:any)=>({...f,done:e.target.checked}))} className="w-5 h-5 accent-[#C9A227]"/>{T(lang,'Done','مكتملة')}</label></>}
          {modal==='broadcast' && <><select className="input" onChange={e=>setForm((f:any)=>({...f,audience:e.target.value}))}><option>All leads</option><option>New inquiries</option><option>Quoted leads</option><option>Active clients</option></select><textarea rows={5} className="input" placeholder={T(lang,'Write your broadcast message…','اكتب رسالة البث الجماعي…')} onChange={e=>setForm((f:any)=>({...f,message:e.target.value}))}/><p className="text-[12px] text-[var(--muted)]">{T(lang,'This records the broadcast in the app. Send it from WhatsApp manually — nothing is sent automatically.','يتم تسجيل الرسالة في التطبيق. أرسلها من واتساب يدوياً — لا يتم إرسال شيء تلقائياً.')}</p></>}
        </div>
        <div className="flex gap-2 mt-5"><button onClick={()=>setModal('')} className="btn-line flex-1">{T(lang,'Cancel','إلغاء')}</button><button disabled={busy} onClick={submitModal} className="btn-gold flex-1 disabled:opacity-60">{busy?T(lang,'Saving…','جارٍ الحفظ…'):(editingId||editingKpi||editingRole?T(lang,'Save Changes','حفظ التعديلات'):modal==='transfer'?T(lang,'Transfer','تحويل'):T(lang,'Save','حفظ'))}</button></div>
      </div></div>}

      {toast && <div className="fixed bottom-4 start-1/2 -translate-x-1/2 z-[60] bg-black text-white text-sm font-bold px-4 py-3 rounded-full shadow-2xl max-w-[92vw] text-center flex items-center gap-2"><CheckCircle2 size={17} className="text-[#E8D48A] flex-none"/><span>{toast}</span></div>}
      <div className="sr-only">Alkader Almohtarif Owner Dashboard</div>
    </div>
  );
}
