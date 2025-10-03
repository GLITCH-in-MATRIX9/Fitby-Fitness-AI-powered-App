import React, { useState } from 'react';
import dietBg from '../assets/diet-bg.jpg';

const DietPlanPage = () => {
  const [form, setForm] = useState({
    age: '',
    gender: '',
    weight: '',
    fitnessGoal: '',
    preferences: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/orkes-diet/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.outputData && data.outputData.status === 'Success') {
        setResult(data.outputData);
      } else {
        setError(data.outputData?.error || 'Failed to generate diet plan.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${dietBg})` }}
    >
      <div className="max-w-2xl w-full mx-auto mt-10 bg-white bg-opacity-90 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Personalized Diet Plan Generator</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Age</label>
          <input type="number" name="age" value={form.age} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} required className="w-full border rounded px-3 py-2">
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Weight (kg)</label>
          <input type="number" name="weight" value={form.weight} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Fitness Goal</label>
          <input type="text" name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="e.g. Weight Gain, Weight Loss, Maintenance" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Preferences / Allergies</label>
          <input type="text" name="preferences" value={form.preferences} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="e.g. Vegetarian, Nut allergy, etc." />
        </div>
        <button type="submit" className="w-full bg-[#c41037] text-white font-bold py-2 rounded hover:bg-[#a30d2c] transition flex items-center justify-center" disabled={loading}>
          {loading ? (
            <>
              <span className="mr-2">Generating...</span>
              <span className="inline-block w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
            </>
          ) : 'Generate Diet Plan'}
        </button>
      </form>
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
        {result && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2 text-[#c41037]">{result.planName}</h3>
            <div className="mb-2 text-gray-700">Estimated Daily Calories: <span className="font-bold">{result.dailyCalories}</span></div>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Day</th>
                    <th className="border px-2 py-1">Meal Time</th>
                    <th className="border px-2 py-1">Item</th>
                    <th className="border px-2 py-1">Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {result.planDetails.map((day, i) => (
                    day.meals.map((meal, j) => (
                      <tr key={i + '-' + j}>
                        {j === 0 && (
                          <td className="border px-2 py-1 font-bold" rowSpan={day.meals.length}>{day.day}</td>
                        )}
                        <td className="border px-2 py-1">{meal.time}</td>
                        <td className="border px-2 py-1">{meal.item}</td>
                        <td className="border px-2 py-1">{meal.calories}</td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietPlanPage;
