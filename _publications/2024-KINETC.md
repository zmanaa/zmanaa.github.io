---
title: "KINETC: Koopman-Inspired Nonlinear Event-Triggered Control from Data"
collection: publications
permalink: /publication/2024-KINETC
excerpt: ''
date: 2024-06-25
venue: ''
paperurl: ''
citation: 'Manaa, Z.M., Abdallah, A.M., and El Ferik, S., 2024. KINETC: Koopman-Inspired Nonlinear Event-Triggered Control from Data.'
---

[Download here](https://zmanaa.github.io/files/KINETC.pdf)

Abstract
======
Event-triggered Control (ETC) presents a promising
paradigm for efficient resource usage in networked and em-
bedded control systems by reducing communication instances
compared to traditional time-triggered strategies. This paper
introduces a novel approach to ETC for discrete-time nonlinear
systems using a data-driven framework. By leveraging Koopman
operator theory, the nonlinear system dynamics are globally lin-
earized (approximately) in a higher-dimensional space. We design
a state-feedback controller and an event-triggering policy directly
from data, ensuring exponential stability in Lyapunov sense. The
proposed Koopman-Inspired Nonlinear Event-Triggered Control
from Data (KINETC) method is validated through extensive sim-
ulation experiments, demonstrating significant resource savings
by reducing the communication instances by 40%.

Main Findigs
======
We consider a case of a nonlinear system with a slow manifold inspired by an example from Brunton et al. (2016):

\[
\begin{align}
\begin{bmatrix}
x_1 \\
x_2
\end{bmatrix}
\mapsto
\begin{bmatrix}
\rho x_1 \\
\kappa x_2 + (\rho^2 - \kappa) x_1^2 + u
\end{bmatrix}
\end{align}
\]

In this scenario, there exists a polynomial stable manifold defined as \(x_2 = x_1^2\). 
Within the Koopman-inspired framework, if the correct lifting observable functions are chosen such that \(\Xi(x) = [x_1, \, x_2, \, x_1^2]\), the nonlinear system in (\ref{eqn:nonlinear_ex}) can be expressed linearly as

\[
\begin{align}
\begin{bmatrix}
z_1 \\
z_2 \\
z_3
\end{bmatrix}_{k+1}
=
\begin{bmatrix}
\rho & 0 & 0 \\
0 & \kappa & (\rho^2 - \kappa) \\
0 & 0 & \rho^2
\end{bmatrix}
\begin{bmatrix}
z_1 \\
z_2 \\
z_3
\end{bmatrix}_k + \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} u_k
\end{align}
\]

Considering the parameters, \(\rho = 0.6\), and \(\kappa = 1.2\) for the system, the eigenvalues of the system are \(\lambda_1 = 0.6\), \(\lambda_2 = 1.2\), and \(\lambda_3 = 0.36\). Since \(\lambda_2 > 1\), the system exhibits instability, and the goal is to stabilize it to the origin.



Please refer to section IV of the paper for full discussion of the results. 
![KINETC Results](../files/all_results.png)


Manaa, Z.M., Abdallah, A.M., and El Ferik, S., 2024. KINETC: Koopman-Inspired Nonlinear Event-Triggered Control from Data.
