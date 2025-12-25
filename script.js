// Language Switching
let currentLanguage = localStorage.getItem('language') || 'en';

// Dark Mode Switching  
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Global data storage for orders and messages
let ordersData = JSON.parse(localStorage.getItem('orders')) || [];
let messagesData = JSON.parse(localStorage.getItem('messages')) || [];
let ratingsData = JSON.parse(localStorage.getItem('ratings')) || [];

function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update all elements with data attributes
    document.querySelectorAll('[data-en]').forEach(element => {
        const key = lang === 'en' ? 'data-en' : 'data-mr';
        const text = element.getAttribute(key);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });

    // Update language button
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.textContent = lang === 'en' ? 'मराठी' : 'EN';
    }
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    
    const body = document.body;
    if (isDarkMode) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
}

// Update order statistics
function updateOrderStats() {
    const totalOrders = ordersData.length;
    const pendingOrders = ordersData.filter(o => o.status === 'pending').length;
    const completedOrders = ordersData.filter(o => o.status === 'completed').length;
    
    const totalOrdersEl = document.getElementById('totalOrders');
    const pendingOrdersEl = document.getElementById('pendingOrders');
    const completedOrdersEl = document.getElementById('completedOrders');
    
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (pendingOrdersEl) pendingOrdersEl.textContent = pendingOrders;
    if (completedOrdersEl) completedOrdersEl.textContent = completedOrders;
    
    displayOrders();
}

// Display orders in admin panel
function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    
    if (!ordersList) return;
    
    if (ordersData.length === 0) {
        ordersList.innerHTML = '<p class="empty-message">No orders yet</p>';
        return;
    }
    
    ordersList.innerHTML = ordersData.map((order, orderIndex) => `
        <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid var(--primary-color);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div>
                    <h4 style="margin: 0 0 0.3rem 0; color: var(--text-dark);">${order.customerName || 'Guest'}</h4>
                    <p style="margin: 0; color: var(--text-light); font-size: 0.85rem;">${order.date || ''}</p>
                </div>
                <span style="background: ${order.status === 'completed' ? '#10b981' : '#f59e0b'}; color: white; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; white-space: nowrap;">
                    ${order.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                </span>
            </div>
            
            <div style="background: rgba(0,0,0,0.1); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <p style="margin: 0 0 0.8rem 0; font-weight: 600; color: var(--text-dark);">Order Items:</p>
                ${order.items && order.items.length > 0 ? order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid rgba(0,0,0,0.1);">
                        <div style="flex: 1;">
                            <span style="color: var(--text-dark);">${item.name}</span>
                            <span style="color: var(--text-light); font-size: 0.85rem;"> × ${item.quantity}</span>
                        </div>
                        <span style="color: var(--primary-color); font-weight: 600;">₹${item.price * item.quantity}</span>
                    </div>
                `).join('') : '<p style="color: var(--text-light); margin: 0;">No items</p>'}
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem; border-top: 2px solid rgba(0,0,0,0.1);">
                <div>
                    <span style="color: var(--text-light); font-size: 0.9rem;">Total: </span>
                    <span style="color: var(--primary-color); font-weight: 700; font-size: 1.1rem;">₹${order.total || 0}</span>
                </div>
                <button onclick="window.deleteOrder(${orderIndex})" style="background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; font-size: 0.85rem; transition: all 0.3s ease;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
                    🗑️ Clear Order
                </button>
            </div>
        </div>
    `).join('');
}

// Delete order from admin
window.deleteOrder = function(index) {
    if (confirm('Are you sure you want to delete this order?')) {
        ordersData.splice(index, 1);
        localStorage.setItem('orders', JSON.stringify(ordersData));
        updateOrderStats();
    }
};

// Update message statistics
function updateMessageStats() {
    const totalMessages = messagesData.length;
    const unreadMessages = messagesData.filter(m => !m.read).length;
    
    const totalMessagesEl = document.getElementById('totalMessages');
    const unreadMessagesEl = document.getElementById('unreadMessages');
    
    if (totalMessagesEl) totalMessagesEl.textContent = totalMessages;
    if (unreadMessagesEl) unreadMessagesEl.textContent = unreadMessages;
    
    displayMessages();
}

// Display messages in admin panel
function displayMessages() {
    const messagesList = document.getElementById('messagesList');
    
    if (!messagesList) return;
    
    if (messagesData.length === 0) {
        messagesList.innerHTML = '<p class="empty-message">No messages yet</p>';
        return;
    }
    
    messagesList.innerHTML = messagesData.map((msg, index) => `
        <div style="background: var(--bg-light); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <strong>${msg.name || 'Anonymous'}</strong>
                <span style="background: ${msg.read ? '#10b981' : '#ef4444'}; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem;">
                    ${msg.read ? '✓ Read' : '📬 Unread'}
                </span>
            </div>
            <p style="margin: 0.5rem 0; color: var(--text-light); font-size: 0.85rem;">
                ${msg.email || 'No email'} - ${msg.subject || 'No subject'}
            </p>
            <p style="margin: 0.5rem 0; color: var(--text-dark); font-size: 0.9rem; max-height: 80px; overflow: hidden; text-overflow: ellipsis;">
                ${msg.message || 'No message'}
            </p>
            <button onclick="window.markMessageAsRead(${index})" style="background: var(--primary-color); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                Mark as ${msg.read ? 'Unread' : 'Read'}
            </button>
        </div>
    `).join('');
}

// Mark message as read (global function)
window.markMessageAsRead = function(index) {
    if (messagesData[index]) {
        messagesData[index].read = !messagesData[index].read;
        localStorage.setItem('messages', JSON.stringify(messagesData));
        updateMessageStats();
    }
};

// Update rating statistics
function updateRatingStats() {
    const totalRatings = ratingsData.length;
    const avgRating = totalRatings > 0 
        ? (ratingsData.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
        : 0;
    
    const totalRatingsEl = document.getElementById('totalRatings');
    const avgRatingEl = document.getElementById('avgRating');
    
    if (totalRatingsEl) totalRatingsEl.textContent = totalRatings;
    if (avgRatingEl) avgRatingEl.textContent = avgRating;
    
    displayRatings();
}

// Display ratings in admin panel
function displayRatings() {
    const ratingsList = document.getElementById('ratingsList');
    
    if (!ratingsList) return;
    
    if (ratingsData.length === 0) {
        ratingsList.innerHTML = '<p class="empty-message">No ratings yet</p>';
        return;
    }
    
    ratingsList.innerHTML = ratingsData.map((rating, index) => `
        <div style="background: var(--bg-light); padding: 1.2rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--highlight-color);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem;">
                <div style="flex: 1;">
                    <div style="margin-bottom: 0.3rem;">
                        <strong style="color: var(--text-dark); font-size: 1rem;">${rating.productName}</strong>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <span style="color: var(--highlight-color); font-size: 1.1rem; letter-spacing: 2px;">${'⭐'.repeat(rating.rating)}</span>
                        <span style="color: var(--text-light); font-size: 0.85rem;">(${rating.rating}/5)</span>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; color: var(--text-light); font-size: 0.85rem;">
                        <strong>By:</strong> ${rating.name}
                    </p>
                </div>
            </div>
            ${rating.review ? `
                <p style="margin: 0.8rem 0 0 0; padding: 0.8rem; background: rgba(0,0,0,0.05); border-radius: 6px; color: var(--text-dark); font-size: 0.9rem; line-height: 1.5;">
                    "${rating.review}"
                </p>
            ` : ''}
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.8rem; padding-top: 0.8rem; border-top: 1px solid rgba(0,0,0,0.1);">
                <span style="color: var(--text-light); font-size: 0.8rem;">${rating.date || ''}</span>
                <button onclick="window.deleteRating(${index})" style="background: #ef4444; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem; transition: all 0.3s ease;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Delete rating from admin
window.deleteRating = function(index) {
    if (confirm('Are you sure you want to delete this rating?')) {
        ratingsData.splice(index, 1);
        localStorage.setItem('ratings', JSON.stringify(ratingsData));
        updateRatingStats();
    }
};

// Rating Modal Functions
window.openRatingModal = function(productName) {
    const modal = document.getElementById('ratingModal');
    const productNameEl = document.getElementById('ratingProductName');
    if (modal && productNameEl) {
        productNameEl.textContent = productName;
        modal.style.display = 'flex';
    }
};

window.closeRatingModal = function() {
    const modal = document.getElementById('ratingModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('ratingForm').reset();
        document.getElementById('selectedRating').value = '0';
        document.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('selected'));
    }
};

window.selectRating = function(rating) {
    document.getElementById('selectedRating').value = rating;
    document.querySelectorAll('.star-btn').forEach((btn, index) => {
        if (index < rating) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
};

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('ratingModal');
    if (modal && event.target === modal) {
        window.closeRatingModal();
    }
});

// Admin Panel Functionality
function initializeAdminPanel() {
    const adminToggle = document.getElementById('adminToggle');
    const adminPanel = document.getElementById('adminPanel');
    const adminClose = document.getElementById('adminClose');

    if (!adminToggle || !adminPanel || !adminClose) {
        console.warn('Admin panel elements not found');
        return;
    }

    // Open admin panel
    adminToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        adminPanel.style.display = 'flex';
    });

    // Close admin panel
    adminClose.addEventListener('click', function() {
        adminPanel.style.display = 'none';
    });

    // Close admin panel when clicking outside
    adminPanel.addEventListener('click', function(e) {
        if (e.target === adminPanel) {
            adminPanel.style.display = 'none';
        }
    });

    // Admin Tab Switching
    const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
    adminTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            adminTabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabElement = document.getElementById(tabName + '-tab');
            if (tabElement) {
                tabElement.classList.add('active');
            }
        });
    });

    // Update stats on load
    updateOrderStats();
    updateMessageStats();
    updateRatingStats();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial theme
    const body = document.body;
    if (isDarkMode) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.textContent = '🌙';
    }

    // Set initial language
    switchLanguage(currentLanguage);

    // Attach event listeners for theme toggle
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleDarkMode);
    }
    
    // Attach event listeners for language toggle
    const langToggleBtn = document.getElementById('langToggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', function() {
            const newLang = currentLanguage === 'en' ? 'mr' : 'en';
            switchLanguage(newLang);
        });
    }

    // Hero Order Button - Scroll to order section
    const heroOrderBtn = document.getElementById('heroOrderBtn');
    if (heroOrderBtn) {
        heroOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const orderSection = document.getElementById('order');
            if (orderSection) {
                orderSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Initialize admin panel functionality
    initializeAdminPanel();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Order Form Handling
    const productSelect = document.getElementById('productSelect');
    const quantityInput = document.getElementById('quantity');
    const qtyPresetBtns = document.querySelectorAll('.qty-preset');
    const addItemBtn = document.getElementById('addItemBtn');
    const orderItemsList = document.getElementById('orderItemsList');
    const summaryTotal = document.getElementById('summaryTotal');
    const orderForm = document.querySelector('.order-form');

    let orderItems = [];
    let selectedQty = 1;

    const productPrices = {
        'Limbu Soda': 20,
        'Jira Soda': 20,
        'Orange Soda': 20,
        'Kalakhatta Soda': 20,
        'Jamfal Soda': 20,
        'Nariyal Soda': 20,
        'Mint Mojito': 20,
        'Blue Berry Soda': 20,
        'Fuljar Soda': 25,
        'Limbu Sharbat': 20,
        'Orange Sharbat': 20,
        'Pineapple Sharbat': 20,
        'Limbu Mix Soda': 20,
        'Pineapple Soda': 20,
        'Masala Soda': 20
    };

    function getProductPrice(productName) {
        const cleanedName = productName.replace(/[🍋🌾🍊🔴🍇🥥🌿🫐✨]/g, '').replace(/\s*-\s*₹\d+/, '').trim();
        return productPrices[cleanedName] || productPrices[productName] || 0;
    }

    function updateOrderSummary() {
        let totalPrice = 0;
        
        orderItems.forEach(item => {
            totalPrice += item.price * item.quantity;
        });
        
        if (summaryTotal) {
            summaryTotal.textContent = '₹' + totalPrice;
        }
    }

    function renderOrderItems() {
        if (!orderItemsList) return;
        
        if (orderItems.length === 0) {
            orderItemsList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 0.5rem;" data-en="No items yet. Add products above!" data-mr="अभी तक कोई आइटम नहीं। ऊपर उत्पादन जोड़ें!">No items yet. Add products above!</p>';
            return;
        }
        
        orderItemsList.innerHTML = orderItems.map((item, index) => `
            <div class="order-item-card-simple">
                <div class="item-info">
                    <div class="item-name-qty">${item.name} × ${item.quantity}</div>
                    <div class="item-price">₹${item.price * item.quantity}</div>
                </div>
                <button type="button" class="remove-btn-simple" data-index="${index}" data-en="Remove" data-mr="हटाएं">Remove</button>
            </div>
        `).join('');
        
        document.querySelectorAll('.remove-btn-simple').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const index = parseInt(this.getAttribute('data-index'));
                orderItems.splice(index, 1);
                renderOrderItems();
                updateOrderSummary();
            });
        });
    }

    // Quantity preset buttons
    if (qtyPresetBtns.length > 0) {
        qtyPresetBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all buttons
                qtyPresetBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                selectedQty = parseInt(this.getAttribute('data-qty'));
                if (quantityInput) {
                    quantityInput.value = selectedQty;
                }
            });
        });
    }

    // Add item to order
    if (addItemBtn) {
        addItemBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!productSelect) return;
            
            const selectedProduct = productSelect.value.trim();
            
            if (!selectedProduct) {
                const errorMsg = currentLanguage === 'en'
                    ? 'Please select a flavour!'
                    : 'कृपया एक स्वाद चुनें!';
                alert(errorMsg);
                return;
            }
            
            const price = getProductPrice(selectedProduct);
            if (price === 0) {
                const errorMsg = currentLanguage === 'en'
                    ? 'Invalid flavour! Please choose from the list.'
                    : 'अमान्य स्वाद! कृपया सूची से चुनें।';
                alert(errorMsg);
                return;
            }
            
            // Check if product already exists
            const existingItem = orderItems.find(item => item.name === selectedProduct);
            if (existingItem) {
                existingItem.quantity += selectedQty;
            } else {
                orderItems.push({
                    name: selectedProduct,
                    quantity: selectedQty,
                    price: price
                });
            }
            
            // Reset
            productSelect.value = '';
            selectedQty = 1;
            if (quantityInput) {
                quantityInput.value = 1;
            }
            qtyPresetBtns.forEach(b => b.classList.remove('active'));
            
            renderOrderItems();
            updateOrderSummary();
            productSelect.focus();
        });
    }

    // Submit order form
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const customerNameInput = document.getElementById('customerName');
            if (!customerNameInput) return;
            
            const name = customerNameInput.value;
            
            if (!name) {
                const errorMsg = currentLanguage === 'en'
                    ? 'Please enter your name!'
                    : 'कृपया अपना नाम दर्ज करें!';
                alert(errorMsg);
                return;
            }
            
            if (orderItems.length === 0) {
                const errorMsg = currentLanguage === 'en'
                    ? 'Please add at least one item!'
                    : 'कृपया कम से कम एक आइटम जोड़ें!';
                alert(errorMsg);
                return;
            }
            
            // Build order details
            let orderDetails = '';
            let totalQty = 0;
            let totalPrice = 0;
            
            orderItems.forEach(item => {
                orderDetails += `• ${item.quantity}x ${item.name}\n`;
                totalPrice += item.price * item.quantity;
                totalQty += item.quantity;
            });
            
            const successMsg = currentLanguage === 'en'
                ? `✓ Order Confirmed!\n\nName: ${name}\n\n${orderDetails}\nTotal: ${totalQty} items = ₹${totalPrice}\n\nWe will call you soon!`
                : `✓ ऑर्डर पुष्टि!\n\nनाम: ${name}\n\n${orderDetails}\nकुल: ${totalQty} आइटम = ₹${totalPrice}\n\nआम्ही जल्द ही कॉल करेंगे!`;
            
            alert(successMsg);
            
            // Store order in admin panel
            const newOrder = {
                id: Date.now(),
                customerName: name,
                items: orderItems,
                total: totalPrice,
                status: 'pending',
                date: new Date().toLocaleString()
            };
            
            ordersData.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(ordersData));
            updateOrderStats();
            
            // Reset form
            orderForm.reset();
            orderItems = [];
            renderOrderItems();
            updateOrderSummary();
        });
    }

    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[type="text"]:first-child').value;
            const email = this.querySelector('input[type="email"]').value;
            const subject = this.querySelector('input[type="text"]:nth-child(3)').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (name && email && subject && message) {
                // Show success message
                const successMsg = currentLanguage === 'en' 
                    ? 'Thank you for your message! We will get back to you soon.'
                    : 'आपल्या संदेशासाठी धन्यवाद! आम्ही लवकरच आपल्याशी संपर्क साधू.';
                alert(successMsg);
                
                // Store message in admin panel
                const newMessage = {
                    id: Date.now(),
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    read: false,
                    date: new Date().toLocaleString()
                };
                
                messagesData.push(newMessage);
                localStorage.setItem('messages', JSON.stringify(messagesData));
                updateMessageStats();
                
                // Reset form
                this.reset();
            } else {
                const errorMsg = currentLanguage === 'en'
                    ? 'Please fill in all fields.'
                    : 'कृपया सर्व फील्ड भरा.';
                alert(errorMsg);
            }
        });
    }

    // Rating form submission
    const ratingForm = document.getElementById('ratingForm');
    if (ratingForm) {
        ratingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('ratingName').value;
            const rating = parseInt(document.getElementById('selectedRating').value);
            const review = document.getElementById('ratingReview').value;
            const productName = document.getElementById('ratingProductName').textContent;
            
            if (!name) {
                const errorMsg = currentLanguage === 'en' ? 'Please enter your name!' : 'कृपया आपले नाव दर्ज करा!';
                alert(errorMsg);
                return;
            }
            
            if (rating === 0) {
                const errorMsg = currentLanguage === 'en' ? 'Please select a rating!' : 'कृपया रेटिंग निवडा!';
                alert(errorMsg);
                return;
            }
            
            // Store rating
            const newRating = {
                id: Date.now(),
                productName: productName,
                name: name,
                rating: rating,
                review: review,
                date: new Date().toLocaleString()
            };
            
            ratingsData.push(newRating);
            localStorage.setItem('ratings', JSON.stringify(ratingsData));
            
            const successMsg = currentLanguage === 'en'
                ? 'Thank you for your rating! Your feedback is valuable to us.'
                : 'आपली रेटिंगसाठी धन्यवाद! आपका मतलब आमच्यासाठी महत्वाचा आहे.';
            alert(successMsg);
            
            window.closeRatingModal();
        });
    }
});

console.log('JK Soda Water Website Loaded Successfully!');
