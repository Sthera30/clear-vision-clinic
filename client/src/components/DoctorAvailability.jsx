import React, { useEffect, useState } from 'react'
import '../css/doctorAvailability.css'
import axios from 'axios';
import toast from 'react-hot-toast';
function DoctorAvailability() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDateTimes, setSelectedDateTimes] = useState({});
    const [activeDate, setActiveDate] = useState(null);
    const [timeInput, setTimeInput] = useState({ start: '09:00', end: '17:00' });
    const [doctor, setDoctor] = useState([]);
    const [doctorname, setDoctorName] = useState('');
    const [availablestatus, setAvailableStatus] = useState('Available');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch all doctors
    async function handle_fetch_doctor() {
        try {
            const res = await axios.get("http://localhost:5000/getAllDoctor");
            if (res.data.success) {
                setDoctor(res.data.data.doctors);
                // Set initial doctor if available
                if (res.data.data.doctors && res.data.data.doctors.length > 0) {
                    setDoctorName(res.data.data.doctors[0].doctorname);
                }
            } else {
                toast.error(res.data.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handle_fetch_doctor();
        window.scrollTo(0, 0)
    }, []);

    // Submit all selected dates and time slots
    async function handle_submit(e) {
        e.preventDefault();
    
        setIsSubmitting(true);
    
        try {
            const availabilityEntries = [];
    
            for (const dateString in selectedDateTimes) {
                if (selectedDateTimes[dateString].length === 0) {
                    // If no time slots are selected, push only the date
                    availabilityEntries.push({
                        doctorname,
                        date: dateString,
                        timeslot: null, // Send null if no time is selected
                        availablestatus
                    });
                } else {
                    for (const timeslot of selectedDateTimes[dateString]) {
                        availabilityEntries.push({
                            doctorname,
                            date: dateString,
                            timeslot: `${timeslot.start}-${timeslot.end}`,
                            availablestatus
                        });
                    }
                }
            }
    
            const response = await axios.post("http://localhost:5000/addDoctorAvailability", {
                entries: availabilityEntries
            });
    
            if (response.data.success) {
                toast.success(`Successfully added ${response.data.insertedCount} availability slots`);
                setSelectedDateTimes({});
                setActiveDate(null);
            } else {
                toast.error(response.data.error || "Some entries failed to save");
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error("Error saving availability. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }
    

    // Time slot increments (30 minutes)
    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
    ];

    // Calendar generation functions
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Format date to YYYY-MM-DD for comparing selected dates
    const formatDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Format date for display
    const formatDateDisplay = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ day: null, date: null });
        }

        // Add actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = formatDateString(date);
            days.push({
                day,
                date: dateString,
                isSelected: Boolean(selectedDateTimes[dateString]),
                isActive: dateString === activeDate
            });
        }

        return days;
    };

    // Handle date selection
    const selectDate = (dateString) => {
        if (!dateString) return;
        setActiveDate(dateString);

        // Initialize time slots if this date wasn't selected before
        if (!selectedDateTimes[dateString]) {
            setSelectedDateTimes(prev => ({
                ...prev,
                [dateString]: []
            }));
        }
    };

    // Add time slot to selected date
    const addTimeSlot = () => {
        if (!activeDate) return;

        const newSlot = {
            start: timeInput.start,
            end: timeInput.end
        };

        setSelectedDateTimes(prev => ({
            ...prev,
            [activeDate]: [...(prev[activeDate] || []), newSlot]
        }));
    };

    // Remove time slot from date
    const removeTimeSlot = (dateString, index) => {
        setSelectedDateTimes(prev => {
            const updatedSlots = [...prev[dateString]];
            updatedSlots.splice(index, 1);

            // If no time slots remain, remove the date entirely
            const updatedDateTimes = { ...prev };
            if (updatedSlots.length === 0) {
                delete updatedDateTimes[dateString];
                // If we're removing time slots from the active date, clear active date
                if (dateString === activeDate) {
                    setActiveDate(null);
                }
            } else {
                updatedDateTimes[dateString] = updatedSlots;
            }

            return updatedDateTimes;
        });
    };

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Get month name
    const getMonthName = (date) => {
        return date.toLocaleString('default', { month: 'long' });
    };

    // Calendar days
    const calendarDays = generateCalendarDays();

    // Get total number of time slots across all dates
    const getTotalTimeSlots = () => {
        return Object.values(selectedDateTimes).reduce((total, slots) =>
            total + slots.length, 0);
    };

    // CSS styles
    const styles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f7f8fc',
            fontFamily: 'Arial, sans-serif'
        },
        formContainer: {
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            width: '100%',
            maxWidth: '600px'
        },
        header: {
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#2563eb',
            marginBottom: '24px'
        },
        formGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
        },
        select: {
            width: '100%',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none'
        },
        flexRow: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px'
        },
        calendarSection: {
            flex: '1',
            width: '100%'
        },
        timeSection: {
            flex: '1',
            minWidth: '228px',
            display: 'flex',
            flexDirection: 'column'
        },
        calendarContainer: {
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            overflow: 'hidden'
        },
        calendarHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f9fafb',
            padding: '12px',
            borderBottom: '1px solid #d1d5db'
        },
        monthNavButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#4b5563'
        },
        monthTitle: {
            fontWeight: '500',
            fontSize: '14px'
        },
        weekdaysRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            padding: '8px 0',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #d1d5db'
        },
        weekday: {
            fontSize: '12px',
            fontWeight: '500',
            color: '#6b7280'
        },
        daysGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            padding: '8px'
        },
        dayCell: {
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '4px'
        },
        daySelected: {
            backgroundColor: '#2563eb',
            color: 'white'
        },
        dayActive: {
            backgroundColor: '#93c5fd',
            color: 'white'
        },
        dayEmpty: {
            cursor: 'default'
        },
        timePickerContainer: {
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            padding: '16px',
            backgroundColor: '#f9fafb'
        },
        timePickerHeader: {
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '12px',
            color: '#374151'
        },
        timePickerInstructions: {
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '12px'
        },
        timeInputGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
        },
        timeInput: {
            padding: '8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '14px',
            width: '100px'
        },
        addButton: {
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer'
        },
        timeSlotsList: {
            marginTop: '16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            overflow: 'hidden',
            backgroundColor: 'white'
        },
        timeSlotItem: {
            padding: '10px 16px',
            borderBottom: '1px solid #d1d5db',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        removeButton: {
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer'
        },
        submitButton: {
            width: '100%',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '3rem',
            padding: '1rem',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '16px'
        },
        disabledButton: {
            backgroundColor: '#9ca3af',
            cursor: 'not-allowed'
        },
        summaryText: {
            fontSize: '14px',
            color: '#374151',
            marginTop: '8px',
            textAlign: 'center'
        },
        selectedDatesSection: {
            marginTop: '20px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            padding: '16px',
            backgroundColor: '#f9fafb'
        },
        selectedDatesHeader: {
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '12px',
            color: '#374151'
        },
        selectedDatesList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        },
        selectedDateItem: {
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            padding: '12px'
        },
        selectedDateTitle: {
            fontWeight: '500',
            marginBottom: '8px'
        },
        selectedDateSlots: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
        },
        selectedDateSlot: {
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '12px'
        }
    };

    return (
        <>
            <div className='doctor-availability-container'>
                <div className='doctor-availability-inner'>
                    <h1>Add Doctor Availability</h1>

                    <form onSubmit={handle_submit}>
                        <label>Doctor</label>
                        <select onChange={(e) => setDoctorName(e.target.value)}>
                            {doctor.map((doc, index) => (
                                <option key={index}>{doc.doctorname}</option>
                            ))}
                        </select>

                        <div style={styles.flexRow}>
                            {/* Calendar Section */}
                            <div className='calendarSection_' style={styles.calendarSection}>
                                <label style={styles.label}>Select Dates</label>

                                <div style={styles.calendarContainer}>
                                    {/* Calendar header */}
                                    <div style={styles.calendarHeader}>
                                        <button
                                            type="button"
                                            onClick={goToPreviousMonth}
                                            style={styles.monthNavButton}
                                        >
                                            &lt;
                                        </button>
                                        <div style={styles.monthTitle}>
                                            {getMonthName(currentMonth)} {currentMonth.getFullYear()}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={goToNextMonth}
                                            style={styles.monthNavButton}
                                        >
                                            &gt;
                                        </button>
                                    </div>

                                    {/* Weekday headers */}
                                    <div style={styles.weekdaysRow}>
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div key={day} style={styles.weekday}>
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Calendar days */}
                                    <div style={styles.daysGrid} >
                                        {calendarDays.map((dayObj, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    ...styles.dayCell,
                                                    ...(dayObj.isSelected ? styles.daySelected : {}),
                                                    ...(dayObj.isActive && !dayObj.isSelected ? styles.dayActive : {}),
                                                    ...(dayObj.day === null ? styles.dayEmpty : {})
                                                }}
                                                onClick={() => dayObj.date && selectDate(dayObj.date)}
                                            >
                                                {dayObj.day}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Time Picker Section */}
                            <div style={styles.timeSection}>
                                <label style={styles.label}>Select Time Slots</label>

                                <div style={styles.timePickerContainer}>
                                    {activeDate ? (
                                        <>
                                            <div style={styles.timePickerHeader}>
                                                Time slots for {formatDateDisplay(activeDate)}
                                            </div>

                                            <div style={styles.timeInputGroup}>
                                                <input
                                                    type="time"
                                                    style={styles.timeInput}
                                                    value={timeInput.start}
                                                    onChange={(e) => setTimeInput(prev => ({ ...prev, start: e.target.value }))}
                                                />
                                                <span>to</span>
                                                <input
                                                    type="time"
                                                    style={styles.timeInput}
                                                    value={timeInput.end}
                                                    onChange={(e) => setTimeInput(prev => ({ ...prev, end: e.target.value }))}
                                                />
                                                <button
                                                    type="button"
                                                    style={styles.addButton}
                                                    onClick={addTimeSlot}
                                                >
                                                    Add
                                                </button>
                                            </div>

                                            {selectedDateTimes[activeDate] && selectedDateTimes[activeDate].length > 0 && (
                                                <div style={styles.timeSlotsList}>
                                                    {selectedDateTimes[activeDate].map((slot, index) => (
                                                        <div key={index} style={styles.timeSlotItem}>
                                                            <span>{slot.start} - {slot.end}</span>
                                                            <button
                                                                type="button"
                                                                style={styles.removeButton}
                                                                onClick={() => removeTimeSlot(activeDate, index)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div style={styles.timePickerInstructions}>
                                            Select a date from the calendar to add time slots
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* All Selected Dates Summary */}
                        {Object.keys(selectedDateTimes).length > 0 && (
                            <div style={styles.selectedDatesSection}>
                                <div style={styles.selectedDatesHeader}>
                                    Selected Dates Summary
                                </div>
                                <div style={styles.selectedDatesList}>
                                    {Object.keys(selectedDateTimes).map(dateString => (
                                        <div key={dateString} style={styles.selectedDateItem}>
                                            <div style={styles.selectedDateTitle}>
                                                {formatDateDisplay(dateString)}
                                            </div>
                                            <div style={styles.selectedDateSlots}>
                                                {selectedDateTimes[dateString].map((slot, index) => (
                                                    <div key={index} style={styles.selectedDateSlot}>
                                                        {slot.start} - {slot.end}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <label style={{ marginTop: '1rem' }}>Availability Status</label>
                        <select onChange={(e) => setAvailableStatus(e.target.value)}>
                            <option>Available</option>
                            <option>Booked</option>
                            <option>Unavailable</option>
                        </select>

                        <button
                            type="submit"
                            style={{
                                ...styles.submitButton,
                                ...(isSubmitting ? styles.disabledButton : {})
                            }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Availability'}
                        </button>

                        {Object.keys(selectedDateTimes).length > 0 && (
                            <div style={styles.summaryText}>
                                {Object.keys(selectedDateTimes).length} dates with {getTotalTimeSlots()} time slots selected
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    )
}

export default DoctorAvailability