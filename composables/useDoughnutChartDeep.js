// composables/useDoughnutChart.js

import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export async function useDoughnutChart() {
  const route = useRoute();

  // Carrega os dados da API de forma assíncrona
  const { data: atletasData, pending, error } = await useFetch(
    `https://api.leandrocesar.com/usersnw/${route.params.id}/team`
  );

  const allUsers = atletasData.value || [];

  // Contagem dos filteredUsers
  const targetsCount = {};
  allUsers.forEach((r) => {
    const target = r.target;
    if (target) {
      targetsCount[target] = (targetsCount[target] || 0) + 1;
    }
  });

  // Definindo os dados do gráfico após os dados serem carregados
  const data = ref({
    labels: [
      `Hipertrofia (${targetsCount.Hipertrofia || 0})`,
      `Emagrecimento (${targetsCount.Emagrecimento || 0})`,
      `Acompanhamento (${targetsCount.Acompanhamento || 0})`
    ],
    datasets: [
      {
        backgroundColor: ['#ff1900', '#ff190090', '#ff190080',],
        data: [
          targetsCount.Hipertrofia || 0,
          targetsCount.Emagrecimento || 0,
          targetsCount.Acompanhamento || 0,
        ],
        borderRadius: 6,
        rotation: 180,
      },
    ],
  });

  // Opções do gráfico
  const options = ref({
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Objetivos - Atletas`,
        color: '#ff1900',
        font: {
          size: 17,
        },
      },
      legend: {
        labels: {
          color: '#ff190090',
          font: {
            size: 11,
          },
        },
      },
    },
  });

  return { data, options, pending, error };
}
