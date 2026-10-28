document.addEventListener('DOMContentLoaded', function () {

  // ==================== 1. القائمة (الثلاث شرطات) ====================
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  // ==================== 2. السلة (Cart) ====================
  var cart = JSON.parse(localStorage.getItem('cart')) || [];
  var cartBtn = document.getElementById('cartBtn');
  var cartOverlay = document.getElementById('cartOverlay');
  var cartDrawer = document.getElementById('cartDrawer');
  var cartClose = document.getElementById('cartClose');
  var cartItems = document.getElementById('cartItems');
  var cartTotalEl = document.getElementById('cartTotal');
  var cartCount = document.getElementById('cartCount');

  function openCart() {
    if(cartOverlay) cartOverlay.classList.add('open');
    if(cartDrawer) cartDrawer.classList.add('open');
  }

  function closeCart() {
    if(cartOverlay) cartOverlay.classList.remove('open');
    if(cartDrawer) cartDrawer.classList.remove('open');
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function renderCart() {
    if (!cartItems) return;
    
    if (cartCount) cartCount.textContent = cart.length;
    
    var total = 0;
    cart.forEach(function(item) { total += item.price; });
    if (cartTotalEl) cartTotalEl.textContent = total.toFixed(2); // بلا عملة كيما طلبت

    if (cart.length === 0) {
      cartItems.innerHTML = '<div style="text-align:center; color:#9ca3af; margin-top:20px;">Your cart is empty</div>';
      return;
    }

    cartItems.innerHTML = '';
    cart.forEach(function(item, index) {
      var div = document.createElement('div');
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      div.style.marginBottom = '15px';
      div.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
      div.style.paddingBottom = '10px';
      div.innerHTML = `
        <div>
          <div style="font-weight: bold; color: #fff;">${item.title}</div>
          <div style="color: #06b6d4;">${item.price.toFixed(2)}</div>
        </div>
        <button class="remove-btn" data-index="${index}" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 18px;">✕</button>
      `;
      cartItems.appendChild(div);
    });

    document.querySelectorAll('.remove-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var index = parseInt(this.getAttribute('data-index'));
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });
  }

  renderCart();

  // ==================== 3. إضافة للسلة ====================
  document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation(); // مهم جداً: باش ما يفتحش نافذة المنتج
      
      var title = this.getAttribute('data-title');
      var price = parseFloat(this.getAttribute('data-price'));
      
      if(title && price) {
        cart.push({ title: title, price: price });
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        openCart();
      }
    });
  });

  // ==================== 4. النافذة والروابط (المنتج) ====================
  var gameCards = document.querySelectorAll('.game-card');
  var modal = document.getElementById('gameModal');
  var closeModal = document.getElementById('closeModal');
  var modalImg = document.getElementById('modalImg');
  var modalTitle = document.getElementById('modalTitle');
  var modalPrice = document.getElementById('modalPrice');
  var modalBuyBtn = document.getElementById('modalBuyBtn');

  if (modal && gameCards.length > 0) {
    gameCards.forEach(function(card) {
      card.addEventListener('click', function(e) {
        
        // إذا كبس على زر السلة، ما نفتحوش النافذة (احتياط إضافي)
        if (e.target.closest('.add-to-cart-btn')) return;

        // السر كامل هنا: كنجبدو المعلومات من "هذا الكارت" لي كبسنا عليه (this)
        var link = this.getAttribute('data-link');
        var title = this.getAttribute('data-title');
        var price = this.getAttribute('data-price');
        var img = this.getAttribute('data-img');

        // نحطوهم في النافذة
        if(modalImg) modalImg.src = img;
        if(modalTitle) modalTitle.textContent = title;
        if(modalPrice) modalPrice.textContent = price;
        
        // هنا كيتبدل رابط العمولة حسب اللعبة لي كبست عليها
        if(modalBuyBtn) modalBuyBtn.href = link; 

        // نفتحو النافذة
        modal.classList.add('open');
      });
    });

    // إغلاق النافذة
    if (closeModal) {
      closeModal.addEventListener('click', function() {
        modal.classList.remove('open');
      });
    }
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

});gameCards.forEach(function(card) {
  card.addEventListener('click', function(e) {
    
    // ⬇️ زيد هاد السطر إجباري (باش يمنع التداخل) ⬇️
    e.stopPropagation(); 

    if (e.target.closest('.add-to-cart-btn')) return;

    var link = this.getAttribute('data-link');
    var title = this.getAttribute('data-title');
    var price = this.getAttribute('data-price');
    var img = this.getAttribute('data-img');

    document.getElementById('modalImg').src = img;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalPrice').textContent = price;
    modalBuyBtn.href = link; 

    modal.classList.add('open');
  });
});