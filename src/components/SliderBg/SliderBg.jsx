import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Autoplay } from 'swiper';
import { toast } from 'react-toastify';

import 'swiper/css';

import { Swiper, SwiperSlide } from 'swiper/react';

import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

import mediaApi from 'api/modules/media.api';
import tmdbConfigs from 'api/configs/tmdb.configs';

import css from './SliderBg.module.scss';
import modeConfig from 'configs/mode.config';

export const SliderBg = () => {
  const [movies, setMovies] = useState([]);
  const [AllGenres, setAllGenres] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');
  const { themeMode } = useSelector(state => state.themeMode);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const { response, err } = await mediaApi.getMovies({
        movieType: tmdbConfigs.movieType.popular,
      });

      if (response) {
        setMovies(response.data.results);
        setIsLoading(false);
      }
      if (err) {
        setError(err.message);
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const { response, err } = await mediaApi.getGenres();

      if (response) {
        setAllGenres(response.data.genres);
        setIsLoading(false);
      }
      if (err) {
        setError(err.message);
        setIsLoading(false);
      }
    })();
  }, []);

  const params = {
    modules: [Autoplay],
    speed: 1500,
    autoplay: {
      delay: 114500,
      disableOnInteraction: false,
    },
    spaceBetween: 50,
    slidesPerView: 1,
  };

  return (
    <Swiper {...params} style={{ width: '100%', height: 'max-content' }}>
      {movies.map(
        (
          {
            id,
            title,
            name,
            backdrop_path: path,
            poster_path: poster,
            vote_average: rating,
            genre_ids: genres,
            overview,
          },
          index
        ) => {
          return (
            <SwiperSlide key={id}>
              <section
                style={{
                  backgroundImage: `url(${tmdbConfigs.backdropPath(
                    path || poster
                  )})`,
                }}
                className={css.section}
              >
                <div className="container">
                  <div className={css.container}>
                    <h2
                      style={{
                        zIndex: 10,
                        ...modeConfig.style.textColor[themeMode],
                      }}
                      className={css.title}
                    >
                      {title || name}
                    </h2>
                    <Stack className={css.rating}>
                      <Rating
                        name="read-only"
                        size="large"
                        color="#fff"
                        defaultValue={rating / 2}
                        precision={0.5}
                        readOnly
                        className={css[`rating__icon__${themeMode}`]}
                      />
                      <p className={css[`rating__text__${themeMode}`]}>
                        {rating ? rating.toFixed(2) : null}
                      </p>
                    </Stack>
                    {/* genres */}
                    {genres.length && AllGenres.length ? (
                      <ul>
                        {genres?.map((genreId, index) => {
                          return (
                            <li key={index}>
                              {
                                AllGenres.find(item => {
                                  return item.id === genreId;
                                }).name
                              }
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                    {/* genres */}
                  </div>
                </div>
                <div
                  style={{
                    width: '80%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    ...modeConfig.style.horizontalGradientBgImage[themeMode],
                  }}
                ></div>
                <div
                  style={{
                    width: '100%',
                    height: '70%',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    ...modeConfig.style.verticalGradientBgImage[themeMode],
                  }}
                ></div>
              </section>
            </SwiperSlide>
          );
        }
      )}
    </Swiper>
  );
};

//  <Stack spacing={4} direction="column">
//    {/* title */}
//    <Typography
//      variant="h4"
//      fontSize={{ xs: '2rem', md: '2rem', lg: '4rem' }}
//      fontWeight="700"
//      sx={{
//        ...uiConfigs.style.typoLines(2, 'left'),
//      }}
//    >
//      {title || name}
//    </Typography>
//    {/* title */}

//    <Stack direction="row" spacing={1} alignItems="center">
//      {/* rating */}
//      <CircularRate value={rating} />
//      {/* rating */}

//      <Divider orientation="vertical" />
//      {/* genres */}
//      {[...genres].splice(0, 2).map((genreId, index) => (
//        <Chip
//          variant="filled"
//          color="primary"
//          key={index}
//          // label={
//          //   genres.find(e => e.id === genreId) &&
//          //   genres.find(e => e.id === genreId).name
//          // }
//        />
//      ))}
//      {/* genres */}
//    </Stack>
//    {/* overview */}
//    <Typography
//      variant="body1"
//      sx={{
//        textAlign: 'justify',
//        display: '-webkit-box',
//        overflow: 'hidden',
//        WebkitBoxOrient: 'vertical',
//        WebkitLineClamp: 3,
//      }}
//    >
//      {overview}
//    </Typography>
//    {/* overview */}

//    {/* buttons */}
//    <Button
//      variant="contained"
//      size="large"
//      startIcon={<PlayArrowIcon />}
//      component={Link}
//      sx={{ width: 'max-content' }}
//    >
//      watch now
//    </Button>
//    {/* buttons */}
//  </Stack>;
