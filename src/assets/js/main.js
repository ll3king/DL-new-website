document.addEventListener('DOMContentLoaded', () => {
    const listViewBtn = document.getElementById('listViewBtn');
    const calendarViewBtn = document.getElementById('calendarViewBtn');
    const listView = document.getElementById('listView');
    const calendarView = document.getElementById('calendarView');
    const bookingListContainer = document.getElementById('bookingListContainer');

    // View Toggling
    listViewBtn.addEventListener('click', () => {
        listViewBtn.classList.add('active');
        calendarViewBtn.classList.remove('active');
        listView.classList.add('active');
        calendarView.classList.remove('active');
    });

    calendarViewBtn.addEventListener('click', () => {
        calendarViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        calendarView.classList.add('active');
        listView.classList.remove('active');
        renderCalendar(); // Re-render calendar when switching
    });

    // Fetch Data
    fetchBookings();

    function fetchBookings() {
        fetch('/api/bookings')
            .then(response => response.json())
            .then(bookings => {
                renderList(bookings);
                window.bookingsData = bookings; // Store for calendar
                // Update specific card if we just processed one, but full re-render is safer for now
            })
            .catch(error => console.error('Error fetching bookings:', error));
    }

    function renderList(bookings) {
        bookingListContainer.innerHTML = '';
        if (bookings.length === 0) {
            bookingListContainer.innerHTML = `<div style="text-align:center; color:#888;">No bookings found yet.</div>`;
            return;
        }

        bookings.forEach(booking => {
            const card = document.createElement('div');
            card.className = 'booking-card';
            const date = new Date(booking.booking_time).toLocaleString();

            // Logic for Process Button
            let actionHtml = '';
            if (booking.status === 'new') {
                actionHtml = `<button class="btn-process" onclick="processBooking(${booking.id})">One-click Process</button>`;
            } else {
                actionHtml = `<span style="color:var(--success-color);">✓ Processed</span>`;
            }

            card.innerHTML = `
                <div class="booking-info">
                    <h3>${booking.customer_name}</h3>
                    <div class="booking-meta">
                        <span>${booking.source}</span>
                        <span>•</span>
                        <span>${date}</span>
                    </div>
                    <div style="margin-top:0.5rem; font-size:0.9rem; color:#555;">
                        ${truncate(booking.details, 80)}
                    </div>
                </div>
                <div class="booking-actions">
                    <span class="status-badge status-${booking.status}">${booking.status}</span>
                    ${actionHtml}
                </div>
            `;
            bookingListContainer.appendChild(card);
        });
    }

    // Expose processBooking to global scope
    window.processBooking = function (id) {
        if (!confirm('Confirm this booking and send auto-reply?')) return;

        const btn = document.querySelector(`button[onclick="processBooking(${id})"]`);
        if (btn) {
            btn.textContent = 'Processing...';
            btn.disabled = true;
        }

        fetch(`/api/bookings/${id}/process`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                // Refresh list to show updated status
                fetchBookings();
                alert('Booking Confirmed & Reply Sent!');
            })
            .catch(err => {
                console.error(err);
                alert('Error processing booking');
                if (btn) {
                    btn.textContent = 'One-click Process';
                    btn.disabled = false;
                }
            });
    };

    function truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + '&hellip;' : str;
    }

    // Simple Calendar Logic
    let currentDate = new Date();

    function renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = '';

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        document.getElementById('currentMonthYear').textContent =
            currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Padding for first day (simple Sunday start)
        for (let i = 0; i < firstDay; i++) {
            const pad = document.createElement('div');
            grid.appendChild(pad);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.innerHTML = `<strong>${d}</strong>`;

            // Find bookings for this day
            if (window.bookingsData) {
                const dayBookings = window.bookingsData.filter(b => {
                    const bDate = new Date(b.booking_time);
                    return bDate.getDate() === d &&
                        bDate.getMonth() === month &&
                        bDate.getFullYear() === year;
                });

                dayBookings.forEach(b => {
                    const div = document.createElement('div');
                    div.style.fontSize = '0.75rem';
                    div.style.color = 'var(--primary-color)';
                    div.textContent = `• ${b.customer_name}`;
                    dayCell.appendChild(div);
                });
            }

            grid.appendChild(dayCell);
        }
    }

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
});
