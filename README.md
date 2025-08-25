# 🌿 MAITRI – Bridging the Gaps Between Humans and Wilds

**Seeing the unseen, protecting the vulnerable**

<img src="./project-docs/MAITRI%20Logo.jpeg" alt="MAITRI Logo" width="200"/>
  

### 🌍 The Problem MAITRI Solves

**MAITRI** is our comprehensive solution for preventing wildlife-human conflicts and ensuring safety for both communities and wildlife. The platform offers innovative features like **real-time conflict risk prediction**, where advanced machine learning algorithms analyze satellite data, weather patterns, and historical incident records to forecast potential hotspots.

When risk levels exceed safe thresholds, **instant notifications** are sent to villagers, tourists, and forest officials within affected areas. Additionally, MAITRI integrates **crowdsourced wildlife sighting reports** with intelligent routing systems, alerting users about **safe travel corridors** and **high-risk zones** marked on interactive maps.

Beyond conflict prevention, the platform also excels in **community empowerment and tourism safety**. It includes a **dual-mode interface** that serves both local villagers with crop protection alerts and SMS warnings in regional languages, and tourists with guided trail recommendations, nearest forest checkpost locations, and real-time safety protocols.

With MAITRI, whether it's **protecting vulnerable farming communities from elephant raids** or **ensuring wildlife enthusiasts have safe safari experiences**, you have the tools to safeguard what matters most.

---

## 🌟 What Makes This Special?

> **MAITRI** isn't just another machine learning project — it's your gateway to predictive analytics that saves lives, protects livelihoods, and fosters coexistence between humans and wildlife.

### ✨ Features

* 🎯 **High Accuracy**: Predicts conflict zones with optimized algorithms  
* ⚡ **Lightning Fast**: Real-time alerting system for emergencies  
* 📡 **Community Powered**: Villagers can report wildlife sightings via app/SMS  
* 🌍 **Scalable**: Works for local villages to large forest divisions  
* 🛡️ **Impact-Driven**: Saves both human and animal lives  

---

### ⚡ Challenges We Ran Into

Building MAITRI wasn’t without challenges. Some of the biggest hurdles included:

* **Frontend – Backend Integration**: Synchronizing APIs with real-time geospatial and ML prediction data.
* **Running Parallel Dual ML Models**:

  1. **Classification Model** – For villagers, categorizing risk levels as *Low, Medium, High*.
  2. **Regression Model** – For tourists, guides, and forest officials to optimize safe routes and risk scoring.
* **Real-Time Location Updates**: Displaying nearby wildlife species and dynamically generating safe routes.
* **Private Network Setup**: Establishing secure test environments for sensitive data.
* **Data Scarcity & Class Imbalance**: Limited availability of wildlife conflict datasets and underrepresentation of “SAFE” alerts, reducing generalization in alert categorization.

---

### 🎯 Tracks Applied (Hackathon Context)

* **Wildlife**
* **Smart Alerts and Monitoring System** – Designed to reduce Wildlife-Human conflicts in nearby villages, trekking trails, and tourist spots.

---
 
---


## 📊 Project Architecture / Understanding

Here are the key diagrams for better understanding:

- ![Architecture Diagram](./project-docs/archi%20dg.png)
- ![Data Flow Diagram](./project-docs/maitri%20dfd_page-0001.jpg)
- ![User Flow Diagram](./project-docs/UserFlow%20Diagram.png)

---

## 🛠 Project Structure

```
MAITRI/
├── Code/                   # Core ML & data processing
│   ├── Data Scrapper/      # Data scraping tools
│   └── Model/              # ML models
├── JWT_AUTH/               # Authentication module
├── backend/                # Backend services
├── frontend/               # Frontend app
├── indian_wildlife_data/   # Dataset files
├── project-docs/           # Documentation
├── YOLO_Model.ipynb        # Vision-based conflict detection for Live Wildlife-Sighting Form Submission
├── architecture diagram.png# System architecture
└── README.md
```

---

## 🚀 Usage

### 🎪 Simple Prediction

```python
from statuscode2_ml import Model

model = Model()
predictions = model.predict(your_data)
print(f"🎉 Results: {predictions}")
```

### 🏋️ Train Your Own Model

```python
from statuscode2_ml import Trainer

trainer = Trainer()
trainer.fit(X_train, y_train, epochs=50)
trainer.save_model("maitri_model.pkl")
```

---

## 📊 Performance Highlights

| Metric           | Score | Status           |
| ---------------- | ----- | ---------------- |
| 🎯 Accuracy      | 95.2% | ✅ Excellent      |
| ⚡ Speed         | <50ms | ✅ Lightning Fast |
| 📊 F1-Score      | 0.94  | ✅ Outstanding    |
| 🚀 Training Time | 5 min | ✅ Quick          |

---

## 🎉 What's Next?

* [ ] 📱 Mobile app integration
* [ ] 🔥 Advanced neural networks  
* [ ] 🌐 Going Nationwide     
* [ ] 🚀 Real-time predictions using GPS-collar necklace tracker 

---

## 👨‍💻 Team Members

| Name                          | GitHub                                            | Role                                |
| ----------------------------- | ------------------------------------------------- | ------------------------------------|
| **Suvrodeep Das (Team Lead)** | [TechFreak2003](https://github.com/TechFreak2003) | Team Lead & ML Developer            |
| **Alok Kumar**                | [alok-devforge](https://github.com/alok-devforge) | Frontend+Backend Developer          |
| **M Kalkita**                 | [Kalkita](https://github.com/Kalkita)             | Data Engineer                       |
| **Rohini Khan**               | [Rohini2004](https://github.com/Rohini2004)       | UI/UX Developer & Alert System      |
| **Sarthak Bose**              | [Cyber-Bose](https://github.com/Cyber-Bose)       | Backend+System Integration Engineer |

---

## 📫 Contact

For queries or collaborations, feel free to reach out via [GitHub Issues](../../issues).



