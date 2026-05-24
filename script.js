function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
}

function changeLang() {
    const isRtl = document.documentElement.dir === 'rtl';
    document.documentElement.dir = isRtl ? 'ltr' : 'rtl';
    document.documentElement.lang = isRtl ? 'en' : 'ar';
    alert("سيتم تغيير اللغة قريباً في تحديث الكود!");
}
